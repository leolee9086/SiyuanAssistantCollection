import { clientApi,plugin } from "../../../../asyncModules.js";
import roster from '../../../ghostDomain/index.js'
import marduk from '../../../index.js'
export const show=async(element,AIChatInterface)=>{
    const menu = new clientApi.Menu()
    const ghosts =await roster.listGhostNames()
    ghosts.forEach(
        ghost=>{
            menu.addItem({
                label:ghost,
                click:async()=>{
                    let container = AIChatInterface.container
                    let oldDoll = AIChatInterface.doll
                    await oldDoll.removeInterface(AIChatInterface)
                    marduk.buildDoll(ghost).then(
                        doll=>{
                            doll.createInterface(
                                {
                                    type: 'textChat',
                                    describe: '一个HTML用户界面,用于向用户展示图文信息',
                                    container: container,
                                }
                            )
                        }
                    )
                }
            })
        }
    )
    let rect = element.getClientRects()[0]
    menu.open({
        x: rect.right - 25 - 76,
        y: rect.bottom,
        isLeft: false,
    });
}