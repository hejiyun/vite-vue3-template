/** 首先, 在进行项目底层配置时, 需要了解config文件配置中,常见的,也就是一般来讲需要去配置的属性都有哪一些, 分别有什么作用
 *
 * 1. publicPath: 加载的静态资源访问路径, 也就是打包之后, 在哪里去找这些静态资源. 比如 设置./, 那么打包之后,就会去./目录下找静态资源
 *
 * 2. indexPath: 相对于打包路径index.html的路径
 *
 * 3. outputDir: 输出文件的目录, 也就是打包后输出文件名称
 *
 * 4. assetsDir: 相对于outputDir的静态资源(js,css,img,fonts)目录
 *
 * 4. lintOnSave:  eslint-loader是否在保存代码时检查, 这个可以设置也可以不设置.与代码规范有关
 *
 * 5.runtimeCompiler/runtime-only: 构建vue的版本选择, 两者的区别在于, 前者体积略大,性能略差, 但是可以选用template或render编写,
 *   后者不包含编辑器,在渲染页面时能节省两步操作,性能略好, 但是只能使用render进行编写,灵活度不高.
 *
 * 6. productionSourceMap: 生产环境时是否开启sourceMap, 什么事sourceMap?可以理解为资源地图, 它可以在控制台准确显示输出语句位置.
 *    对查错时很有帮助,因为打包之后代码都是压缩加密的, 如果运行时报错,输出信息时很难准确知道在哪里的.
 *    当然缺点在于在打包时, 会对js文件生成对应的.map文件. 打包总体积增大.
 *
 * 7. pluginOptions: 主要用于修改第三方插件的配置
 *
 * 8. chainWebpack/configureWebpack: 两者的作用相同, 都是用于修改webpack默认的配置, 区别在于一个通过链式修改, 一个通过操作对象修改.
 *
 * 9. parallel:  构建时开启多进程处理 babel 编译, 单核无作用, 多核时自动开启
 *
 * 10. css: 项目中css类文件处理规则,
 *
 * 11. devServer: 配置开发环境服务器,实现请求代理，避免出现跨域
 *
 * 12. build: 打包具体配置, 可以指定打包过程中的文件处理及最终打包文件生成位置,配置中有特别注意的地方需要关注理解
 */

// 关于打包环境配置,  首先引入 loadEnv环境变量, 它可以手动读取对应配置文件参数.
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './env')
  console.log(env, 'zheli环境')
  return {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: './static',
    indexPath: './index.html',
    lintOnSave: true,
    // runtimeCompiler: true,
    // transpileDependencies: [],// 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false,
    resolve: {
      alias: {
        // 配置文件引用时, 快捷路径. 当前设置为当使用@引用时, 默认从src文件夹开始计算层级.
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // 使用configureWebpack来配置生产环境文件压缩率(当然, 这个是举例使用方法.)
    configureWebpack: (config: any) => {
      if (process.env.NODE_ENV === 'production') {
        // 为生产环境修改配置...
        config.mode = 'production'
        config.performance = {
          //打包文件大小配置
          maxEntrypointSize: 10000000,
          maxAssetSize: 30000000,
        }
      }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理 babel 编译
    css: {
      // modules: true, // 是否开启支持‘foo.module.css’样式
      // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
      // 开启 CSS source maps?
      // sourceMap: false,
      // css预设器配置项
      loaderOptions: {
        sass: {
          data: '', //`@import "@/assets/scss/mixin.scss";`
        },
        css: {
          // options here will be passed to css-loader
        },
        postcss: {
          // options here will be passed to postcss-loader
        },
      },
      // 启用 CSS modules for all css / pre-processor files.
      modules: false,
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [path.resolve(__dirname, './src/assets/less/global.less')],
      },
    },
    server: {
      port: 8080, //启动端口
      hmr: {
        host: '127.0.0.1',
        port: 8080,
      },
      // 设置 https 代理
      proxy: {
        '/api': {
          target: 'your https address',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      // 通过mode来区别打包时输出的位置即可.
      outDir: mode == 'development' ? 'dist' : 'prod', //指定输出路径
      rollupOptions: {
        output: {
          //静态资源分类打包
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: function (AssetInfo) {
            // 这里详细的说下, 这些属性可以使用方法去进行更详细的个人操作, 比如更细致的分类等等,自定义设置.
            return AssetInfo.name.split('.')[1] !== 'css'
              ? 'static/img/[name]-[hash].[ext]'
              : 'static/[ext]/[name]-[hash].[ext]'
          },
          manualChunks(id) {
            //静态资源分拆打包
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    plugins: [vue()],
  }
})
