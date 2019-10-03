module.exports = {
    module: {
      rules: [
        {
            test: /\.(js|tsx)?$/,
            use: {
              loader: 'awesome-typescript-loader'
            },
            exclude: /node_modules/         }
        
      ]
    }
  };