import { SetMetadata, applyDecorators } from "@nestjs/common";
import { IpcHandle, IpcOn } from '@doubleshot/nest-electron';

export class DecoratorConstant {
	static readonly method_description="method_description"
	static readonly params_interface_name="params_interface_name"
	static readonly return_interface_name="return_interface_name"
	static readonly return_list="return_list"
	static readonly bind_ipc="bind_ipc"
	static readonly bind_ipc_type="bind_ipc_type"
}

/**生成与渲染线程交互的方法 */
export function BindIpcHandle(options:{key:string,description?:string,paramsInterface?:string,returnInterface?:string,returnList?:boolean}): MethodDecorator {
	let defaultOpt={paramsInterface:"null",returnInterface:"any",returnList:false}
	let opt=Object.assign(defaultOpt,options)
	return applyDecorators(
		IpcHandle(opt.key),
		SetMetadata(DecoratorConstant.bind_ipc,opt.key),
		SetMetadata(DecoratorConstant.bind_ipc_type,"invoke"),
		SetMetadata(DecoratorConstant.params_interface_name, opt.paramsInterface),
		SetMetadata(DecoratorConstant.return_interface_name, opt.returnInterface),
		SetMetadata(DecoratorConstant.return_list, opt.returnList),
	);
}

export function BindIpcOn(options:{key:string,description?:string,paramsInterface?:string,returnInterface?:string,returnList?:boolean}): MethodDecorator {
	let defaultOpt={paramsInterface:"null",returnInterface:"any",returnList:false}
	let opt=Object.assign(defaultOpt,options)
	return applyDecorators(
		IpcOn(opt.key),
		SetMetadata(DecoratorConstant.bind_ipc,opt.key),
		SetMetadata(DecoratorConstant.bind_ipc_type,"send"),
		SetMetadata(DecoratorConstant.params_interface_name, opt.paramsInterface),
		SetMetadata(DecoratorConstant.return_interface_name, opt.returnInterface),
		SetMetadata(DecoratorConstant.return_list, opt.returnList),
	);
}
