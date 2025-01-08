import { SetMetadata, applyDecorators } from "@nestjs/common";
import { IpcHandle, IpcOn } from '@doubleshot/nest-electron';

export class DecoratorConstant {
	static readonly bind_ipc="bind_ipc"
	static readonly bind_ipc_type="bind_ipc_type"
}

/**生成与渲染线程交互的方法 */
export function BindIpcHandle(options:{key:string,description?:string}): MethodDecorator {
	return applyDecorators(
		IpcHandle(options.key),
		SetMetadata(DecoratorConstant.bind_ipc,options.key),
		SetMetadata(DecoratorConstant.bind_ipc_type,"invoke"),
	);
}

export function BindIpcOn(options:{key:string,description?:string}): MethodDecorator {
	return applyDecorators(
		IpcOn(options.key),
		SetMetadata(DecoratorConstant.bind_ipc,options.key),
		SetMetadata(DecoratorConstant.bind_ipc_type,"send"),
	);
}
