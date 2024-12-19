import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/user';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const userStore = useUserStore();
    const { permissions } = userStore.userInfo;
    console.log("value",value)
    if (Array.isArray(value)) {
        if (value.length > 0) {
            const permissionValues = value;
            // 对当前用户的角色权限和传入指令的权限类型进行比对。如果当前用户无权限则会执行节点删除操作。
            const hasPermission = permissions.some((permission) => {
                return permissionValues.includes(permission);
            });
            if (!hasPermission && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    } else {
        throw new Error(`need roles! Like v-permission="['admin','user']"`);
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding);
    },
};