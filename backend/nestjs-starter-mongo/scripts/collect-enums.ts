import { Project, SyntaxKind } from "ts-morph";
import fs from 'fs'
import path from "path";

class EnumCollector {
    project;
    constructor() {
        this.project = new Project({
            tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json")
        });

        this.findEnums();
    }
    findEnums() {
        console.log("开始收集已标注的枚举值作为字典数据")
        let json=[]
        const sourceFiles = this.project.getSourceFiles();
        sourceFiles.forEach(sourceFile => {
            sourceFile.forEachChild(node => {
                if (node.getKind() === SyntaxKind.EnumDeclaration) {
                    let target=node
                    const enumName = target.getName();
                    const enumMembers = target.getMembers();
                    let labelName=''
                    target.getJsDocs().forEach(doc => {
                        doc.getTags().forEach(tag=>{
                            if(tag.getTagName()=='dict-label'){
                                labelName=tag.getCommentText()
                            }
                        })
                    })
                    if(!labelName){
                        return
                    }
                    let dictionary={
                        labelName,
                        labelKey:enumName,
                        options:[]
                    }

                    enumMembers.forEach(member => {
                        let valueLabel=member.getName();
                        member.getJsDocs().forEach(doc => {
                            doc.getTags().forEach(tag=>{
                                if(tag.getTagName()=='dict-value'){
                                    valueLabel=tag.getCommentText()
                                }
                            })
                        })
                        dictionary.options.push({
                            value:member.getValue(),
                            label:valueLabel
                        })
                    })
                    if(!json.some(item=>item.labelKey==enumName)){
                        json.push(dictionary)
                    }
                }
            })
        })
        fs.writeFileSync(path.resolve(__dirname,'../dist/enum.json'), JSON.stringify(json,null,2))
        console.log("字典数据收集完成")
    }
}
new EnumCollector()