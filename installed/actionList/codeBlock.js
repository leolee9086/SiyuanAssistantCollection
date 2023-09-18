export let dicts ='//'

let 注释对象 = {
    'js':'/**/',
    'css':''
}
export default[
    {
        icon:'',
        label:'注释',
        hints:'//,zhushi,注释,zs',
        hintAction:(context)=>{
            console.log(context.token)
            context.token.select()
            context.token.delete()
            let lang = context.blocks[0].firstElement.querySelector('.protyle-action--first.protyle-action__language')
            if(lang){
                lang = lang.textcontent
                context.protyle.insert('/*')

            }

        },
        types:'c'
    }
]