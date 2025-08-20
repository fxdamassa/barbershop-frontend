const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                sweetalert2: path.resolve(__dirname, 'src/shims/empty-swal.js'),
            },
        },
    },
};
