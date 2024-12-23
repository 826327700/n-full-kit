"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _tsmorph = require("ts-morph");
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var EnumCollector = /*#__PURE__*/ function() {
    "use strict";
    function EnumCollector() {
        _class_call_check(this, EnumCollector);
        _define_property(this, "project", void 0);
        this.project = new _tsmorph.Project({
            tsConfigFilePath: _path.default.resolve(__dirname, "../tsconfig.json")
        });
        this.findEnums();
    }
    _create_class(EnumCollector, [
        {
            key: "findEnums",
            value: function findEnums() {
                console.log("开始收集已标注的枚举值作为字典数据");
                var json = [];
                var sourceFiles = this.project.getSourceFiles();
                sourceFiles.forEach(function(sourceFile) {
                    sourceFile.forEachChild(function(node) {
                        if (node.getKind() === _tsmorph.SyntaxKind.EnumDeclaration) {
                            var target = node;
                            var enumName = target.getName();
                            var enumMembers = target.getMembers();
                            var labelName = '';
                            target.getJsDocs().forEach(function(doc) {
                                doc.getTags().forEach(function(tag) {
                                    if (tag.getTagName() == 'dict-label') {
                                        labelName = tag.getCommentText();
                                    }
                                });
                            });
                            if (!labelName) {
                                return;
                            }
                            var dictionary = {
                                labelName: labelName,
                                labelKey: enumName,
                                options: []
                            };
                            enumMembers.forEach(function(member) {
                                var valueLabel = member.getName();
                                member.getJsDocs().forEach(function(doc) {
                                    doc.getTags().forEach(function(tag) {
                                        if (tag.getTagName() == 'dict-value') {
                                            valueLabel = tag.getCommentText();
                                        }
                                    });
                                });
                                dictionary.options.push({
                                    value: member.getValue(),
                                    label: valueLabel
                                });
                            });
                            if (!json.some(function(item) {
                                return item.labelKey == enumName;
                            })) {
                                json.push(dictionary);
                            }
                        }
                    });
                });
                _fs.default.writeFileSync(_path.default.resolve(__dirname, '../static/enum.json'), JSON.stringify(json, null, 2));
                console.log("字典数据收集完成");
            }
        }
    ]);
    return EnumCollector;
}();
new EnumCollector();

