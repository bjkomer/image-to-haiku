require.config({
    baseUrl: "js",    
    paths: {
        'angular': '.../angular.min',
        'angular-route': '.../angular-route.min',
        'angularAMD': '.../angularAMD.min',
        'Clarifai': '.../clarify_node'
    },
    shim: { 'angularAMD': ['angular'], 'angular-route': ['angular'] },
    deps: ['app']
});