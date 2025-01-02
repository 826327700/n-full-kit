<template>
    <div class="custom-layout-frame">
        <div class="custom-layout-frame-body">
            <div class="custom-layout-frame-aside">
                <Aside></Aside>
            </div>
            <div class="custom-layout-frame-main">
                <div class="custom-layout-frame-header">
                    <Header></Header>
                </div>
                <div class="custom-layout-frame-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import Aside from './aside.vue';
import Header from './header/header.vue';

</script>
<style scoped lang="scss">
.custom-layout-frame{
    height: 100vh;
    display: flex;
    flex-direction: column;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #ebf0fa url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNiIgY3k9IjYiIHI9Ii43NSIgZmlsbD0iI0M1Q0VFMCIvPjwvc3ZnPg==) repeat;
        z-index: -1;
    }
    .custom-layout-frame-body{
        flex: 1;
        display: flex;
        height: 0;
        .custom-layout-frame-aside{
            max-width: 250px;
            min-width: 40px;
            padding: 15px;
        }
        .custom-layout-frame-main{
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            padding: 15px 15px 15px 0;
            overflow: hidden;
            .custom-layout-frame-header{
                position: relative;
            }
            .custom-layout-frame-content{
                flex: 1;
                margin-top: 15px;
                height: 0;
                width: 100%;
                overflow: hidden;
            }
        }
    }
}
</style>
