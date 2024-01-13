export let processorFeatureDict = {
    languageProcessor: {
        base: [
            'completeChat', 
            //'completeText', 
            //'extractTextFeatures',
            //'summarize',
            //'chatSummarize'
        ],
        pro: ['translate', 'summarize', 'sentimentAnalysis']
    },
    ImageProcessor: {
        base: ['resize', 'crop', 'rotate',  'extractImageFeatures'],
        pro: ['applyFilter', 'detectObjects', 'convertToGrayscale','imageToText','textToimage']
        },
    AudioProcessor: {
        base: ['audioToText', 'textToAudio'],
        pro: ['stop', 'adjustVolume']
    },
    FileSystemProcessor: {
        base: ['readFile', 'writeFile', 'appendFile', 'deleteFile', 'copyFile', 'moveFile'],
        pro: ['createDir', 'deleteDir', 'listDir', 'moveDir', 'copyDir']
    },
    Searcher: {
        base: ['searchweb', 'searchBlock'],
        pro: ['searchBlockWithVector']
    }
    // add more processors and their features here
}
export let driversFeatureDict={
    textChatter:{
        base:['showHistory','on','off','printAImessage','printUserMessage','clearMessage','open','close'],
        pro:['printAImessageStyled'],
        
    },
    audioChatter:{
        base:['speak','listen','on','off',]
    },
    avatar: {
        base: ['performSad', 'performHappy', 'performAngry', 'performSurprised'],
        pro: ['performCustomEmotion', 'changeAppearance']
    }
}