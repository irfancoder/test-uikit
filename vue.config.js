const path = require('path')
const vueSrc = "./src"

module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {
        config.module.rules.delete("svg");
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, vueSrc),
                "~": path.resolve(__dirname, vueSrc),
                img: path.join(__dirname, vueSrc, './img'),
                sass: path.resolve(__dirname, vueSrc, './sass')
            },
            extensions: ['.js', '.vue', '.json']
        },
        module: {
            // rules: [
            //     {
            //         test: /\.vue$/,
            //         loader: 'f-loader',
            //         options: {
            //             transformAssetUrls: {
            //                 video: ['src', 'poster'],
            //                 source: 'src',
            //                 image: ['xlink:href', 'href'],
            //                 use: ['xlink:href', 'href']
            //             }
            //         }
            //     },
            // ],
        }
    }
}