import babel from 'rollup-plugin-babel';

export default {
    plugins: [babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-rollup']
    })]
};
