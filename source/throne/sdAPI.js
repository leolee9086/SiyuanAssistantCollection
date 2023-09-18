import json
import requests
import io
import base64
from PIL import Image, PngImagePlugin
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Any


const Upscaler = {
    none: "None",
    Lanczos: "Lanczos",
    Nearest: "Nearest",
    LDSR: "LDSR",
    BSRGAN: "BSRGAN",
    ESRGAN_4x: "ESRGAN_4x",
    R_ESRGAN_General_4xV3: "R-ESRGAN General 4xV3",
    ScuNET_GAN: "ScuNET GAN",
    ScuNET_PSNR: "ScuNET PSNR",
    SwinIR_4x: "SwinIR 4x"
}

const HiResUpscaler = {
    none: "None",
    Latent: "Latent",
    LatentAntialiased: "Latent (antialiased)",
    LatentBicubic: "Latent (bicubic)",
    LatentBicubicAntialiased: "Latent (bicubic antialiased)",
    LatentNearest: "Latent (nearist)",
    LatentNearestExact: "Latent (nearist-exact)",
    Lanczos: "Lanczos",
    Nearest: "Nearest",
    ESRGAN_4x: "ESRGAN_4x",
    LDSR: "LDSR",
    ScuNET_GAN: "ScuNET GAN",
    ScuNET_PSNR: "ScuNET PSNR",
    SwinIR_4x: "SwinIR 4x"
}


class WebUIApiResult {
    constructor(images, parameters, info) {
        this.images = images;
        this.parameters = parameters;
        this.info = info;
    }

    get image() {
        return this.images[0];
    }
}


class ControlNetUnit {
    constructor(
        input_image = null,
        mask = null,
        module = "none",
        model = "None",
        weight = 1.0,
        resize_mode = "Resize and Fill",
        lowvram = false,
        processor_res = 512,
        threshold_a = 64,
        threshold_b = 64,
        guidance = 1.0,
        guidance_start = 0.0,
        guidance_end = 1.0,
        control_mode = 0,
        pixel_perfect = false,
        guessmode = null
    ) {
        this.input_image = input_image;
        this.mask = mask;
        this.module = module;
        this.model = model;
        this.weight = weight;
        this.resize_mode = resize_mode;
        this.lowvram = lowvram;
        this.processor_res = processor_res;
        this.threshold_a = threshold_a;
        this.threshold_b = threshold_b;
        this.guidance = guidance;
        this.guidance_start = guidance_start;
        this.guidance_end = guidance_end;
        if (guessmode) {
            console.log("ControlNetUnit guessmode is deprecated. Please use control_mode instead.");
            control_mode = guessmode;
        }
        this.control_mode = control_mode;
        this.pixel_perfect = pixel_perfect;
    }

    to_dict() {
        return {
            "input_image": this.input_image ? raw_b64_img(this.input_image) : "",
            "mask": this.mask ? raw_b64_img(this.mask) : null,
            "module": this.module,
            "model": this.model,
            "weight": this.weight,
            "resize_mode": this.resize_mode,
            "lowvram": this.lowvram,
            "processor_res": this.processor_res,
            "threshold_a": this.threshold_a,
            "threshold_b": this.threshold_b,
            "guidance": this.guidance,
            "guidance_start": this.guidance_start,
            "guidance_end": this.guidance_end,
            "control_mode": this.control_mode,
            "pixel_perfect": this.pixel_perfect,
        };
    }
}
function b64_img(image) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
}

function raw_b64_img(image) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    let dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/png;base64,/, '');
    }

class WebUIApi{
    has_controlnet = False

    constructor(
        host = "127.0.0.1",
        port = 7860,
        baseurl = null,
        sampler = "Euler a",
        steps = 20,
        use_https = false,
        username = null,
        password = null
    ) {
        if (baseurl === null) {
            baseurl = use_https ? `https://${host}:${port}/sdapi/v1` : `http://${host}:${port}/sdapi/v1`;
        }

        this.baseurl = baseurl;
        this.default_sampler = sampler;
        this.default_steps = steps;

        this.session = {}; // In JavaScript, you might use the 'axios' library or the Fetch API instead of 'requests.Session()'

        if (username && password) {
            this.set_auth(username, password);
        } else {
            this.check_controlnet();
        }
    }
    check_controlnet() {
        try {
            let scripts = this.get_scripts();
            this.has_controlnet = scripts["txt2img"].includes("controlnet m2m");
        } catch (error) {
            // Handle error if needed
        }
    }

    set_auth(username, password) {
        this.session.auth = { username, password };
        this.check_controlnet();
    }
    async _to_api_result(response) {
        if (response.status !== 200) {
            throw new Error(`${response.status}: ${await response.text()}`);
        }
    
        let r = await response.json();
        let images = [];
        if ("images" in r) {
            images = r["images"].map(i => new Image(`data:image/png;base64,${i}`));
        } else if ("image" in r) {
            images = [new Image(`data:image/png;base64,${r["image"]}`)];
        }
    
        let info = "";
        if ("info" in r) {
            try {
                info = JSON.parse(r["info"]);
            } catch {
                info = r["info"];
            }
        } else if ("html_info" in r) {
            info = r["html_info"];
        } else if ("caption" in r) {
            info = r["caption"];
        }
    
        let parameters = "";
        if ("parameters" in r) {
            parameters = r["parameters"];
        }
    
        return new WebUIApiResult(images, parameters, info);
    }
    async _to_api_result_async(response) {
        if (response.status !== 200) {
            throw new Error(`${response.status}: ${await response.text()}`);
        }
    
        let r = await response.json();
        let images = [];
        if ("images" in r) {
            images = r["images"].map(i => new Image(`data:image/png;base64,${i}`));
        } else if ("image" in r) {
            images = [new Image(`data:image/png;base64,${r["image"]}`)];
        }
    
        let info = "";
        if ("info" in r) {
            try {
                info = JSON.parse(r["info"]);
            } catch {
                info = r["info"];
            }
        } else if ("html_info" in r) {
            info = r["html_info"];
        } else if ("caption" in r) {
            info = r["caption"];
        }
    
        let parameters = "";
        if ("parameters" in r) {
            parameters = r["parameters"];
        }
    
        return new WebUIApiResult(images, parameters, info);
    }

    async txt2img(
        enable_hr = false,
        denoising_strength = 0.7,
        firstphase_width = 0,
        firstphase_height = 0,
        hr_scale = 2,
        hr_upscaler = HiResUpscaler.Latent,
        hr_second_pass_steps = 0,
        hr_resize_x = 0,
        hr_resize_y = 0,
        prompt = "",
        styles = [],
        seed = -1,
        subseed = -1,
        subseed_strength = 0.0,
        seed_resize_from_h = 0,
        seed_resize_from_w = 0,
        sampler_name = null,  // use this instead of sampler_index
        batch_size = 1,
        n_iter = 1,
        steps = null,
        cfg_scale = 7.0,
        width = 512,
        height = 512,
        restore_faces = false,
        tiling = false,
        do_not_save_samples = false,
        do_not_save_grid = false,
        negative_prompt = "",
        eta = 1.0,
        s_churn = 0,
        s_tmax = 0,
        s_tmin = 0,
        s_noise = 1,
        override_settings = {},
        override_settings_restore_afterwards = true,
        script_args = null,  // List of arguments for the script "script_name"
        script_name = null,
        send_images = true,
        save_images = false,
        alwayson_scripts = {},
        controlnet_units = [],  // List of ControlNetUnit
        sampler_index = null,  // deprecated: use sampler_name
        use_deprecated_controlnet = false,
        use_async = false,
    ) {
        if (sampler_index === null) {
            sampler_index = this.default_sampler;
        }
        if (sampler_name === null) {
            sampler_name = this.default_sampler;
        }
        if (steps === null) {
            steps = this.default_steps;
        }
        if (script_args === null) {
            script_args = [];
        }
        let payload = {
            "enable_hr": enable_hr,
            "hr_scale": hr_scale,
            "hr_upscaler": hr_upscaler,
            "hr_second_pass_steps": hr_second_pass_steps,
            "hr_resize_x": hr_resize_x,
            "hr_resize_y": hr_resize_y,
            "denoising_strength": denoising_strength,
            "firstphase_width": firstphase_width,
            "firstphase_height": firstphase_height,
            "prompt": prompt,
            "styles": styles,
            "seed": seed,
            "subseed": subseed,
            "subseed_strength": subseed_strength,
            "seed_resize_from_h": seed_resize_from_h,
            "seed_resize_from_w": seed_resize_from_w,
            "batch_size": batch_size,
            "n_iter": n_iter,
            "steps": steps,
            "cfg_scale": cfg_scale,
            "width": width,
            "height": height,
            "restore_faces": restore_faces,
            "tiling": tiling,
            "do_not_save_samples": do_not_save_samples,
            "do_not_save_grid": do_not_save_grid,
            "negative_prompt": negative_prompt,
            "eta": eta,
            "s_churn": s_churn,
            "s_tmax": s_tmax,
            "s_tmin": s_tmin,
            "s_noise": s_noise,
            "override_settings": override_settings,
            "override_settings_restore_afterwards": override_settings_restore_afterwards,
            "sampler_name": sampler_name,
            "sampler_index": sampler_index,
            "script_name": script_name,
            "script_args": script_args,
            "send_images": send_images,
            "save_images": save_images,
            "alwayson_scripts": alwayson_scripts,
        };
    
        if (use_deprecated_controlnet && controlnet_units && controlnet_units.length > 0) {
            payload["controlnet_units"] = controlnet_units.map(x => x.to_dict());
            return await this.custom_post(
                "controlnet/txt2img", payload, use_async
            );
        }
    
        if (controlnet_units && controlnet_units.length > 0) {
            payload["alwayson_scripts"]["ControlNet"] = {
                "args": controlnet_units.map(x => x.to_dict())
            };
        } else if (this.has_controlnet) {
            // workaround : if not passed, webui will use previous args!
            payload["alwayson_scripts"]["ControlNet"] = {"args": []};
        }
    
        return await this.post_and_get_api_result(
            `${this.baseurl}/txt2img`, payload, use_async
        );
    }

    async post_and_get_api_result(url, json, use_async) {
        if (use_async) {
            return this.async_post(url, json);
        } else {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            });
            return await this._to_api_result(response);
        }
    }
    async async_post(url, json) {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.session.auth ? `Basic ${btoa(`${this.session.auth.username}:${this.session.auth.password}`)}` : ''
            },
            body: JSON.stringify(json),
        });
        return await this._to_api_result_async(response);
    }
    async img2img(
        images = [],  // list of Image objects
        resize_mode = 0,
        denoising_strength = 0.75,
        image_cfg_scale = 1.5,
        mask_image = null,  // Image mask
        mask_blur = 4,
        inpainting_fill = 0,
        inpaint_full_res = true,
        inpaint_full_res_padding = 0,
        inpainting_mask_invert = 0,
        initial_noise_multiplier = 1,
        prompt = "",
        styles = [],
        seed = -1,
        subseed = -1,
        subseed_strength = 0,
        seed_resize_from_h = 0,
        seed_resize_from_w = 0,
        sampler_name = null,  // use this instead of sampler_index
        batch_size = 1,
        n_iter = 1,
        steps = null,
        cfg_scale = 7.0,
        width = 512,
        height = 512,
        restore_faces = false,
        tiling = false,
        do_not_save_samples = false,
        do_not_save_grid = false,
        negative_prompt = "",
        eta = 1.0,
        s_churn = 0,
        s_tmax = 0,
        s_tmin = 0,
        s_noise = 1,
        override_settings = {},
        override_settings_restore_afterwards = true,
        script_args = null,  // List of arguments for the script "script_name"
        sampler_index = null,  // deprecated: use sampler_name
        include_init_images = false,
        script_name = null,
        send_images = true,
        save_images = false,
        alwayson_scripts = {},
        controlnet_units = [],  // List of ControlNetUnit
        use_deprecated_controlnet = false,
        use_async = false,
    ) {
        if (sampler_name === null) {
            sampler_name = this.default_sampler;
        }
        if (sampler_index === null) {
            sampler_index = this.default_sampler;
        }
        if (steps === null) {
            steps = this.default_steps;
        }
        if (script_args === null) {
            script_args = [];
        }
        let payload = {
            "init_images": images.map(x => x.toDataURL()),
            "resize_mode": resize_mode,
            "denoising_strength": denoising_strength,
            "mask_blur": mask_blur,
            "inpainting_fill": inpainting_fill,
            "inpaint_full_res": inpaint_full_res,
            "inpaint_full_res_padding": inpaint_full_res_padding,
            "inpainting_mask_invert": inpainting_mask_invert,
            "initial_noise_multiplier": initial_noise_multiplier,
            "prompt": prompt,
            "styles": styles,
            "seed": seed,
            "subseed": subseed,
            "subseed_strength": subseed_strength,
            "seed_resize_from_h": seed_resize_from_h,
            "seed_resize_from_w": seed_resize_from_w,
            "batch_size": batch_size,
            "n_iter": n_iter,
            "steps": steps,
            "cfg_scale": cfg_scale,
            "image_cfg_scale": image_cfg_scale,
            "width": width,"height": height,
            "restore_faces": restore_faces,
            "tiling": tiling,
            "do_not_save_samples": do_not_save_samples,
            "do_not_save_grid": do_not_save_grid,
            "negative_prompt": negative_prompt,
            "eta": eta,
            "s_churn": s_churn,
            "s_tmax": s_tmax,
            "s_tmin": s_tmin,
            "s_noise": s_noise,
            "override_settings": override_settings,
            "override_settings_restore_afterwards": override_settings_restore_afterwards,
            "sampler_name": sampler_name,
            "sampler_index": sampler_index,
            "include_init_images": include_init_images,
            "script_name": script_name,
            "script_args": script_args,
            "send_images": send_images,
            "save_images": save_images,
            "alwayson_scripts": alwayson_scripts,
        };
        if (mask_image !== null) {
            payload["mask"] = mask_image.toDataURL();
        }
    
        if (use_deprecated_controlnet && controlnet_units && controlnet_units.length > 0) {
            payload["controlnet_units"] = controlnet_units.map(x => x.to_dict());
            return await this.custom_post(
                "controlnet/img2img", payload, use_async
            );
        }
    
        if (controlnet_units && controlnet_units.length > 0) {
            payload["alwayson_scripts"]["ControlNet"] = {
                "args": controlnet_units.map(x => x.to_dict())
            };
        } else if (this.has_controlnet) {
            payload["alwayson_scripts"]["ControlNet"] = {"args": []};
        }
    
        return await this.post_and_get_api_result(
            `${this.baseurl}/img2img`, payload, use_async
        );
    }

    async  extraSingleImage(
        image,  // Image data in base64 format
        resizeMode = 0,
        showExtrasResults = true,
        gfpganVisibility = 0,
        codeformerVisibility = 0,
        codeformerWeight = 0,
        upscalingResize = 2,
        upscalingResizeW = 512,
        upscalingResizeH = 512,
        upscalingCrop = true,
        upscaler1 = "None",
        upscaler2 = "None",
        extrasUpscaler2Visibility = 0,
        upscaleFirst = false,
        useAsync = false,
    ) {
        let payload = {
            "resize_mode": resizeMode,
            "show_extras_results": showExtrasResults,
            "gfpgan_visibility": gfpganVisibility,
            "codeformer_visibility": codeformerVisibility,
            "codeformer_weight": codeformerWeight,
            "upscaling_resize": upscalingResize,
            "upscaling_resize_w": upscalingResizeW,
            "upscaling_resize_h": upscalingResizeH,
            "upscaling_crop": upscalingCrop,
            "upscaler_1": upscaler1,
            "upscaler_2": upscaler2,
            "extras_upscaler_2_visibility": extrasUpscaler2Visibility,
            "upscale_first": upscaleFirst,
            "image": image,  // Assuming image is already in base64 format
        };
    
        return await this.postAndGetApiResult(
            `${this.baseurl}/extra-single-image`, payload, useAsync
        );
    }

    async extraBatchImages(
        images,  // List of images in base64 format
        nameList = null,  // List of image names
        resizeMode = 0,
        showExtrasResults = true,
        gfpganVisibility = 0,
        codeformerVisibility = 0,
        codeformerWeight = 0,
        upscalingResize = 2,
        upscalingResizeW = 512,
        upscalingResizeH = 512,
        upscalingCrop = true,
        upscaler1 = "None",
        upscaler2 = "None",
        extrasUpscaler2Visibility = 0,
        upscaleFirst = false,
        useAsync = false,
    ) {
        if (nameList !== null && nameList.length !== images.length) {
            throw new Error("len(images) != len(nameList)");
        } else if (nameList === null) {
            nameList = images.map(
                (_, i) => {return `image${(i + 1).toString().padStart(5, '0')}`}
            )
        }
    
        let imageList = [];
        for (let i = 0; i < images.length; i++) {
            imageList.push({"data": images[i], "name": nameList[i]});
        }
    
        let payload = {
            "resize_mode": resizeMode,
            "show_extras_results": showExtrasResults,
            "gfpgan_visibility": gfpganVisibility,
            "codeformer_visibility": codeformerVisibility,
            "codeformer_weight": codeformerWeight,
            "upscaling_resize": upscalingResize,
            "upscaling_resize_w": upscalingResizeW,
            "upscaling_resize_h": upscalingResizeH,
            "upscaling_crop": upscalingCrop,
            "upscaler_1": upscaler1,
            "upscaler_2": upscaler2,
            "extras_upscaler_2_visibility": extrasUpscaler2Visibility,
            "upscale_first": upscaleFirst,
            "imageList": imageList,
        };
    
        return await this.postAndGetApiResult(
            `${this.baseurl}/extra-batch-images`, payload, useAsync
        );
    }

    /**
     * XXX 500 error (2022/12/26)
     * @param {string} image - base64 encoded image
     * @returns {Promise} - API result
     */
    async pngInfo(image) {
        let payload = {
            "image": image,  // Assuming image is already in base64 format
        };
    
        return await this.postAndGetApiResult(`${this.baseurl}/png-info`, payload);
    }
    /**
     * @param {string} image - base64 encoded image
     * @param {string} model - model type, default is "clip"
     * @returns {Promise} - API result
     */
    async interrogate(image, model = "clip") {
        let payload = {
            "image": image,  // Assuming image is already in base64 format
            "model": model,
        };
    
        return await this.postAndGetApiResult(`${this.baseurl}/interrogate`, payload);
    }
    async interrupt() {
        return await this.postAndGetApiResult(`${this.baseurl}/interrupt`);
    }
    
    async skip() {
        return await this.postAndGetApiResult(`${this.baseurl}/skip`);
    }
    
    async getOptions() {
        return await this.getApiResult(`${this.baseurl}/options`);
    }
    
    async setOptions(options) {
        return await this.postAndGetApiResult(`${this.baseurl}/options`, options);
    }
    
    async getCmdFlags() {
        return await this.getApiResult(`${this.baseurl}/cmd-flags`);
    }
    
    async getProgress() {
        return await this.getApiResult(`${this.baseurl}/progress`);
    }
    
    async getSamplers() {
        return await this.getApiResult(`${this.baseurl}/samplers`);
    }

    async getSdVae() {
        return await this.getApiResult(`${this.baseurl}/sd-vae`);
        }
        
        async getUpscalers() {
        return await this.getApiResult(`${this.baseurl}/upscalers`);
        }
        
        async getLatentUpscaleModes() {
        return await this.getApiResult(`${this.baseurl}/latent-upscale-modes`);
        }
        
        async getLoras() {
        return await this.getApiResult(`${this.baseurl}/loras`);
        }
        
        async getSdModels() {
        return await this.getApiResult(`${this.baseurl}/sd-models`);
        }
        
        async getHypernetworks() {
        return await this.getApiResult(`${this.baseurl}/hypernetworks`);
        }
        
        async getFaceRestorers() {
        return await this.getApiResult(`${this.baseurl}/face-restorers`);
        }
        
        async getRealesrganModels() {
        return await this.getApiResult(`${this.baseurl}/realesrgan-models`);
        }
        
        async getPromptStyles() {
        return await this.getApiResult(`${this.baseurl}/prompt-styles`);
        }
        
        async getArtistCategories() {
        return await this.getApiResult(`${this.baseurl}/artist-categories`);
        }
        
        async getArtists() {
        return await this.getApiResult(`${this.baseurl}/artists`);
        }
        
        async refreshCheckpoints() {
        return await this.postAndGetApiResult(`${this.baseurl}/refresh-checkpoints`);
        }
        
        async getScripts() {
        return await this.getApiResult(`${this.baseurl}/scripts`);
        }
        
        async getEmbeddings() {
        return await this.getApiResult(`${this.baseurl}/embeddings`);
        }
        
        async getMemory() {
        return await this.getApiResult(`${this.baseurl}/memory`);
        }
        
        getEndpoint(endpoint, baseurl) {
        if (baseurl) {
        return `${this.baseurl}/${endpoint}`;
        } else {
        let parsedUrl = new URL(this.baseurl);
        let basehost = parsedUrl.host;
        return `${parsedUrl.protocol}//${basehost}/${endpoint}`;
        }
        }

        async customGet(endpoint, baseurl = false) {
            let url = this.getEndpoint(endpoint, baseurl);
            return await this.getApiResult(url);
            }
            
            async customPost(endpoint, payload = {}, baseurl = false, useAsync = false) {
            let url = this.getEndpoint(endpoint, baseurl);
            if (useAsync) {
            // JavaScript is inherently asynchronous, so we don't need to do anything special here
            return this.postAndGetApiResult(url, payload);
            } else {
            return await this.postAndGetApiResult(url, payload);
            }
            }
            
            async controlnetVersion() {
            let result = await this.customGet("controlnet/version");
            return result["version"];
            }
            
            async controlnetModelList() {
            let result = await this.customGet("controlnet/model_list");
            return result["model_list"];
            }
            
            async controlnetModuleList() {
            let result = await this.customGet("controlnet/module_list");
            return result["module_list"];
            }
            
            async controlnetDetect(images, module = "none", processorRes = 512, thresholdA = 64, thresholdB = 64) {
            let inputImages = images; // Assuming images are already in base64 format
            let payload = {
            "controlnet_module": module,
            "controlnet_input_images": inputImages,
            "controlnet_processor_res": processorRes,
            "controlnet_threshold_a": thresholdA,
            "controlnet_threshold_b": thresholdB,
            };
            let result = await this.customPost("controlnet/detect", payload);
            return result;
            }
            
            async utilGetModelNames() {
            let models = await this.getSdModels();
            return models.map(model => model["title"]).sort();
            }
            
            async utilSetModel(name, findClosest = true) {
            let models = await this.utilGetModelNames();
            let foundModel = null;
            if (models.includes(name)) {
            foundModel = name;
            } else if (findClosest) {
            // JavaScript doesn't have a built-in string similarity function, so we'll just find the first model that includes the name
            foundModel = models.find(model => model.includes(name));
            }
            if (foundModel) {
            console.log(`loading ${foundModel}`);
            let options = {};
            options["sd_model_checkpoint"] = foundModel;
            await this.setOptions(options);
            console.log(`model changed to ${foundModel}`);
            } else {
            console.log("model not found");
            }
            }
            
            async utilGetCurrentModel() {
            let options = await this.getOptions();
            if ("sd_model_checkpoint" in options) {
            return options["sd_model_checkpoint"];
            } else {
            let sdModels = await this.getSdModels();
            let sdModel = sdModels.find(model => model["sha256"] === options["sd_checkpoint_hash"]);
            return sdModel["title"];
            }
            }
            
            async utilWaitForReady(checkInterval = 5000) {
            while (true) {
            let result = await this.getProgress();
            let progress = result["progress"];
            let jobCount = result["state"]["job_count"];
            if (progress === 0.0 && jobCount === 0) {
            break;
            } else {
            console.log(`[WAIT]: progress = ${progress.toFixed(4)}, job_count = ${jobCount}`);
            await new Promise(resolve => setTimeout(resolve, checkInterval));
            }
            }
            }
            
}

## Interface for extensions


# https://github.com/mix1009/model-keyword
@dataclass
class ModelKeywordResult:
    keywords: list
    model: str
    oldhash: str
    match_source: str


class ModelKeywordInterface:
    def __init__(self, webuiapi):
        self.api = webuiapi

    def get_keywords(self):
        result = self.api.custom_get("model_keyword/get_keywords")
        keywords = result["keywords"]
        model = result["model"]
        oldhash = result["hash"]
        match_source = result["match_source"]
        return ModelKeywordResult(keywords, model, oldhash, match_source)





# https://github.com/Klace/stable-diffusion-webui-instruct-pix2pix
class InstructPix2PixInterface:
    def __init__(self, webuiapi):
        self.api = webuiapi

    def img2img(
        self,
        images=[],
        prompt: str = "",
        negative_prompt: str = "",
        output_batches: int = 1,
        sampler: str = "Euler a",
        steps: int = 20,
        seed: int = 0,
        randomize_seed: bool = True,
        text_cfg: float = 7.5,
        image_cfg: float = 1.5,
        randomize_cfg: bool = False,
        output_image_width: int = 512,
    ):
        init_images = [b64_img(x) for x in images]
        payload = {
            "init_images": init_images,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "output_batches": output_batches,
            "sampler": sampler,
            "steps": steps,
            "seed": seed,
            "randomize_seed": randomize_seed,
            "text_cfg": text_cfg,
            "image_cfg": image_cfg,
            "randomize_cfg": randomize_cfg,
            "output_image_width": output_image_width,
        }
        return self.api.custom_post("instruct-pix2pix/img2img", payload=payload)


#https://github.com/AUTOMATIC1111/stable-diffusion-webui-rembg
class RemBGInterface:
    def __init__(self, webuiapi):
        self.api = webuiapi

    def rembg(
        self,
        input_image: str = "", #image string (?)
        model: str = 'u2net',  #[None, 'u2net', 'u2netp', 'u2net_human_seg', 'u2net_cloth_seg','silueta','isnet-general-use','isnet-anime']
        return_mask: bool = False,
        alpha_matting: bool = False,
        alpha_matting_foreground_threshold: int = 240,
        alpha_matting_background_threshold: int = 10,
        alpha_matting_erode_size: int = 10
    ):

        payload = {
            "input_image": b64_img(input_image),
            "model": model,
            "return_mask": return_mask,
            "alpha_matting":  alpha_matting,
            "alpha_matting_foreground_threshold": alpha_matting_foreground_threshold,
            "alpha_matting_background_threshold": alpha_matting_background_threshold,
            "alpha_matting_erode_size": alpha_matting_erode_size
        }
        return self.api.custom_post("rembg", payload=payload)


# https://github.com/Mikubill/sd-webui-controlnet
class ControlNetInterface:
    def __init__(self, webuiapi, show_deprecation_warning=True):
        self.api = webuiapi
        self.show_deprecation_warning = show_deprecation_warning

    def print_deprecation_warning(self):
        print(
            "ControlNetInterface txt2img/img2img is deprecated. Please use normal txt2img/img2img with controlnet_units param"
        )

    def txt2img(
        self,
        prompt: str = "",
        negative_prompt: str = "",
        controlnet_input_image: [] = [],
        controlnet_mask: [] = [],
        controlnet_module: str = "",
        controlnet_model: str = "",
        controlnet_weight: float = 0.5,
        controlnet_resize_mode: str = "Scale to Fit (Inner Fit)",
        controlnet_lowvram: bool = False,
        controlnet_processor_res: int = 512,
        controlnet_threshold_a: int = 64,
        controlnet_threshold_b: int = 64,
        controlnet_guidance: float = 1.0,
        enable_hr: bool = False,  # hiresfix
        denoising_strength: float = 0.5,
        hr_scale: float = 1.5,
        hr_upscale: str = "Latent",
        guess_mode: bool = True,
        seed: int = -1,
        subseed: int = -1,
        subseed_strength: int = -1,
        sampler_index: str = "Euler a",
        batch_size: int = 1,
        n_iter: int = 1,  # Iteration
        steps: int = 20,
        cfg_scale: float = 7,
        width: int = 512,
        height: int = 512,
        restore_faces: bool = False,
        override_settings: Dict[str, Any] = None,
        override_settings_restore_afterwards: bool = True,
    ):
        if self.show_deprecation_warning:
            self.print_deprecation_warning()

        controlnet_input_image_b64 = [raw_b64_img(x) for x in controlnet_input_image]
        controlnet_mask_b64 = [raw_b64_img(x) for x in controlnet_mask]

        payload = {
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "controlnet_input_image": controlnet_input_image_b64,
            "controlnet_mask": controlnet_mask_b64,
            "controlnet_module": controlnet_module,
            "controlnet_model": controlnet_model,
            "controlnet_weight": controlnet_weight,
            "controlnet_resize_mode": controlnet_resize_mode,
            "controlnet_lowvram": controlnet_lowvram,
            "controlnet_processor_res": controlnet_processor_res,
            "controlnet_threshold_a": controlnet_threshold_a,
            "controlnet_threshold_b": controlnet_threshold_b,
            "controlnet_guidance": controlnet_guidance,
            "enable_hr": enable_hr,
            "denoising_strength": denoising_strength,
            "hr_scale": hr_scale,
            "hr_upscale": hr_upscale,
            "guess_mode": guess_mode,
            "seed": seed,
            "subseed": subseed,
            "subseed_strength": subseed_strength,
            "sampler_index": sampler_index,
            "batch_size": batch_size,
            "n_iter": n_iter,
            "steps": steps,
            "cfg_scale": cfg_scale,
            "width": width,
            "height": height,
            "restore_faces": restore_faces,
            "override_settings": override_settings,
            "override_settings_restore_afterwards": override_settings_restore_afterwards,
        }
        return self.api.custom_post("controlnet/txt2img", payload=payload)

    def img2img(
        self,
        init_images: [] = [],
        mask: str = None,
        mask_blur: int = 30,
        inpainting_fill: int = 0,
        inpaint_full_res: bool = True,
        inpaint_full_res_padding: int = 1,
        inpainting_mask_invert: int = 1,
        resize_mode: int = 0,
        denoising_strength: float = 0.7,
        prompt: str = "",
        negative_prompt: str = "",
        controlnet_input_image: [] = [],
        controlnet_mask: [] = [],
        controlnet_module: str = "",
        controlnet_model: str = "",
        controlnet_weight: float = 1.0,
        controlnet_resize_mode: str = "Scale to Fit (Inner Fit)",
        controlnet_lowvram: bool = False,
        controlnet_processor_res: int = 512,
        controlnet_threshold_a: int = 64,
        controlnet_threshold_b: int = 64,
        controlnet_guidance: float = 1.0,
        guess_mode: bool = True,
        seed: int = -1,
        subseed: int = -1,
        subseed_strength: int = -1,
        sampler_index: str = "",
        batch_size: int = 1,
        n_iter: int = 1,  # Iteration
        steps: int = 20,
        cfg_scale: float = 7,
        width: int = 512,
        height: int = 512,
        restore_faces: bool = False,
        include_init_images: bool = True,
        override_settings: Dict[str, Any] = None,
        override_settings_restore_afterwards: bool = True,
    ):
        if self.show_deprecation_warning:
            self.print_deprecation_warning()

        init_images_b64 = [raw_b64_img(x) for x in init_images]
        controlnet_input_image_b64 = [raw_b64_img(x) for x in controlnet_input_image]
        controlnet_mask_b64 = [raw_b64_img(x) for x in controlnet_mask]

        payload = {
            "init_images": init_images_b64,
            "mask": raw_b64_img(mask) if mask else None,
            "mask_blur": mask_blur,
            "inpainting_fill": inpainting_fill,
            "inpaint_full_res": inpaint_full_res,
            "inpaint_full_res_padding": inpaint_full_res_padding,
            "inpainting_mask_invert": inpainting_mask_invert,
            "resize_mode": resize_mode,
            "denoising_strength": denoising_strength,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "controlnet_input_image": controlnet_input_image_b64,
            "controlnet_mask": controlnet_mask_b64,
            "controlnet_module": controlnet_module,
            "controlnet_model": controlnet_model,
            "controlnet_weight": controlnet_weight,
            "controlnet_resize_mode": controlnet_resize_mode,
            "controlnet_lowvram": controlnet_lowvram,
            "controlnet_processor_res": controlnet_processor_res,
            "controlnet_threshold_a": controlnet_threshold_a,
            "controlnet_threshold_b": controlnet_threshold_b,
            "controlnet_guidance": controlnet_guidance,
            "guess_mode": guess_mode,
            "seed": seed,
            "subseed": subseed,
            "subseed_strength": subseed_strength,
            "sampler_index": sampler_index,
            "batch_size": batch_size,
            "n_iter": n_iter,
            "steps": steps,
            "cfg_scale": cfg_scale,
            "width": width,
            "height": height,
            "restore_faces": restore_faces,
            "include_init_images": include_init_images,
            "override_settings": override_settings,
            "override_settings_restore_afterwards": override_settings_restore_afterwards,
        }
        return self.api.custom_post("controlnet/img2img", payload=payload)

    def model_list(self):
        r = self.api.custom_get("controlnet/model_list")
        return r["model_list"]