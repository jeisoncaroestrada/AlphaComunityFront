angular.module("Alpha")
.controller('LoginCtrl',function($scope,$http,$location,$rootScope,$sce,$timeout,$window,alphaFactory){

	$scope.sessionMessage = false;
	$scope.success = false;
	$scope.form = {
		name: 'Jeison',
		address: 'la funlam',
		phone: '12345'
	}

	$scope.loginNew = function () {
		alphaFactory.save({ store: $scope.form}, function () {
		 $scope.form = "";
		});
	}

	angular.element($window).bind('resize', function() {
       	$rootScope.windowHeight = $window.innerHeight;
       	$rootScope.windowWidth = $window.innerWidth;

		$( ".video-panel" ).css( "height", $window.innerHeight );
		$( "video" ).css( "margin-left", ($window.innerWidth / 2) -750 );
    })

    $( ".video-panel" ).css( "height", $window.innerHeight );
    $( "video" ).css( "margin-left", ($window.innerWidth / 2) -750 );


    $timeout(function(){
		$scope.modalLoginShow = true;
	    $('#showModalLogin').trigger('click');
	}, 1000)

	/**
	 * se ejecuta cuando se cierra el modal de login
	 */
	$scope.closeModalLogin = function () {
		$scope.form = {
			city: '',
			title: '',
			shortDescription: '',
			description: '',
		}
		$scope.sessionMessage = false;
		$scope.success = false;
		$rootScope.goTo('/da')

	};

	$scope.check = true;

	$http.post('loginCheck', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

		}else if(data['name1']){

			$location.path( "/start/platform" );

		}

		$scope.check = false;

    })
    .error(function(data)
    {
    	$scope.sessionMessage = 'Por favor ingrese el Usuario y Contraseña';
    	console.log(data);
    });

	//funcion que valida el inicio de sesion 
	$scope.login = function(){

		$scope.processing = true
        //peticion al servidor usando php
        $http.post('login', $scope.form)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.sessionMessage = [data['error']]
    		}else if(data['active']){
    			$scope.sessionMessage = data;
    		}else if(data['name1']){
    			$scope.sessionMessage = false
    			$scope.success = 'Bienvenido! ' + data['name1']
    			$location.path( "/start/platform" );

    		}

    		$scope.processing = false

        })
        .error(function(data)
        {
        	console.log(data);
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}
			
        	$scope.processing = false
        });       
	};

	//funcion que se encarga de enviar la peticion al servidor para restablecer la contraseña
	$scope.rememberPassword = function(){

		$scope.processing = true
		$scope.isRemember = true;
        //peticion al servidor usando php
        $http.post('remember', {user:$scope.form.user})
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.success = false;
        		$scope.sessionMessage = [data['error']]
    		}else if(data['success']){
    			$scope.sessionMessage = false
    			$scope.success = false;
    			$scope.success = data['success']
    			$timeout(function(){
    				location.reload();
	   			}, 20000)
    		}

    		$scope.processing = false

        })
        .error(function(data)
        {
        	$scope.success = false;
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}
			
        	$scope.processing = false
        });       
	};

	// Para usar el html en angular
	$scope.sanitize = function (item) {
		if(!item) return
		return $sce.trustAsHtml(item);
	}


})

.controller('SignupCtrl',function($scope,$http,$location,$rootScope,$sce){

	$scope.sessionMessage = false;
	$scope.success = false;

	//se instancia el objeto que contiene todos los campos del formulario
	$scope.form = {

		check1: '',
		check2: '',
		password_confirmation: '',
		password: '',
		email: '',
		lastname2: '',
		lastname1: '',
		name2: '',
		name1: ''

	};

	// Para usar el html en angular
	$scope.sanitize = function (item) {
		if(!item) return
		return $sce.trustAsHtml(item);
	}

	$scope.signUp = function(){

		$scope.processing = true;
		$scope.success = false;

		if(!$scope.form.check1){//condicion que valida que los checkbox se seleccionen

			$scope.form.check1 = '';
		}

		if(!$scope.form.check2){//condicion que valida que los checkbox se seleccionen

			$scope.form.check2 = '';
		}

        //peticion al servidor usando http
        $http.post('signup', $scope.form)
        .success(function(data)
        {	
        	if(data['success']){
				$scope.sessionMessage = false;
        		$scope.success = data['success']
        		$scope.form = {

					password_confirmation: '',
					password: '',
					email: '',
					lastname2: '',
					lastname1: '',
					name2: '',
					name1: ''

				};

    		}else{

    		}

        	$scope.processing = false
    		

        })
        .error(function(data)
        {
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}
			
        	$scope.processing = false
        });

       
	};

	

})

.controller('VerifyCtrl',function($scope,$http,$location,$rootScope,$sce,$stateParams){

	$scope.success = '<span class="is-error bold-600">!Ocurrio un error </span>por favor abrir el enlace directamente del correo o verficar que copie y pegue la direccion completa';
	$scope.img = 'error';
	$scope.processing = true

	//se instancia el objeto que contiene todos los campos del formulario
	$scope.form = {
		token: $stateParams.c,
		code: $stateParams.n,
	};

	// Para usar el html en angular
	$scope.sanitize = function (item) {
		if(!item) return
		return $sce.trustAsHtml(item);
	}

        //peticion al servidor usando php
        $http.post('verify', $scope.form)
        .success(function(data)
        {	
        	
        	if(data['success']){
        		$scope.success = data['success']
        		$scope.img = 'verify';
    		}else{
    			$scope.success = data['error']
    			$scope.img = 'error';
    		};
    		$scope.processing = false;
        })
        .error(function(data)
        {
        	$scope.processing = false;
        	$scope.success = '<span class="is-error bold-600">!Ocurrio un error </span>por favor abrir el enlace directamente del correo o verficar que copie y pegue la direccion completa'
        });    

	

})

.controller('ChangePasswordCtrl',function($scope,$http,$location,$rootScope,$sce,$stateParams){

	$scope.verifyMsg = '';
	$scope.img = 'error';
	$scope.checking = true

	//se instancia el objeto que contiene todos los campos del formulario
	$scope.form = {
		token: $stateParams.c,
		code: $stateParams.n,
		user: '',
		email: '',
		password: '',
		password_confirmation: ''
	};

	console.log($scope.form);

	// Para usar el html en angular
	$scope.sanitize = function (item) {
		if(!item) return
		return $sce.trustAsHtml(item);
	}

    //peticion al servidor usando php para verificar que la url tenga los parametros validos para realizar el cambio de contraseña
    $http.post('verifyUser', $scope.form)
    .success(function(data)
    {	
    	
    	if(data['user']){
    		$scope.img = 'verify';
    		$scope.form.user = data['user'].name1 +' ' + data['user'].lastname1;
    		$scope.form.email = data['user'].email;
    		$scope.verifyMsg = '<span class="is-success bold-600">Ahora puedes cambiar</span> tu contraseña de ingreso a Alpha.net';

		}else{
			$scope.verifyMsg = data['error']
			$scope.img = 'error';
		};
		$scope.checking = false;
    })
    .error(function(data)
    {
    	$scope.checking = false;
    	$scope.verifyMsg = '<span class="is-error bold-600">!Ocurrio un error </span>por favor abrir el enlace directamente del correo o verficar que copie y pegue la direccion completa'
    }); 

    //funcion que cambia la contraseña para el usuario enviado por url 
	$scope.changePassword = function(){

		$scope.processing = true
        //peticion al servidor usando php
        $http.post('changePassword', $scope.form)
        .success(function(data)
        {	
        	
        	
			$scope.sessionMessage = false
			$scope.success = data['success']
    		$scope.processing = false
        })
        .error(function(data)
        {
        	$scope.sessionMessage = [];
        	console.log(data);
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}
			
        	$scope.processing = false
        });       
	};   

	

})

.controller('HomeCtrl',function($scope,$http,$location,$rootScope,$window,$timeout,$sce, alphaFactory){

	angular.element($window).bind('resize', function() {
       	$rootScope.windowHeight = $window.innerHeight;
       	$rootScope.windowWidth = $window.innerWidth;

		$( ".video-panel" ).css( "height", $window.innerHeight );
		$( "video" ).css( "margin-left", ($window.innerWidth / 2) -750 );
    })

    $( ".video-panel" ).css( "height", $window.innerHeight );
    $( "video" ).css( "margin-left", ($window.innerWidth / 2) -750 );

	$scope.declarateNewUser = function () {
		
		$scope.newUser = {
			name1: '',
			name2: '',
			lastname1: '',
			lastname2: '',
			email: '',
			address: '',
			phone: '',
			password: '',
			password_confirmation: '',
			i_accept_terms_and_conditions: false
		}
	}

	$scope.declarateUser = function () {
		
		$scope.user = {
			email: '',
			password: '',
		}
	}


	$scope.loginNew = function () {
		console.log($scope.user);
		$scope.processing = true
		alphaFactory.query({ user: $scope.user},
		function (success) {
			console.log(success);
		 	$scope.declarateNewUser();
		 	$scope.signUpMessage = false;
		 	$scope.signUpSuccess = "Su cuenta fue creada exitosamente."
		 	$scope.processing = false
		}, 
		function (error) {
	        	$scope.signUpMessage = [];
				for(var m in error.data) {
				   $scope.signUpMessage.push(error.data[m][0]);
				}
				
	        	$scope.processing = false
		});
	}

	//funcion que valida el inicio de sesion 
	$scope.login = function(){

		$scope.processing = true
        //peticion al servidor usando php
        $http.post($rootScope.baseUrl + 'login', $scope.user)
        .success(function(data)
        {	
        	
        	/*if(data['error']){
        		$scope.sessionMessage = [data['error']]
    		}else if(data['active']){
    			$scope.sessionMessage = data;
    		}else if(data['name1']){
    			$scope.sessionMessage = false
    			$scope.success = 'Bienvenido! ' + data['name1']
    			$location.path( "/start/platform" );

    		}

    		$scope.processing = false*/

    		console.log(data);

        })
        .error(function(data)
        {
        	console.log(data);
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}
			
        	$scope.processing = false
        });       
	};

	$scope.signUp = function () {
		$scope.signUpSuccess = false;
		$scope.processing = true;
		alphaFactory.save({ user: $scope.newUser},
		function (success) {

		 	$scope.declarateNewUser();
		 	$scope.signUpMessage = false;
		 	$scope.signUpSuccess = "Su cuenta fue creada exitosamente."
		 	$scope.processing = false
		}, 
		function (error) {
	        	$scope.signUpMessage = [];
				for(var m in error.data) {
				   $scope.signUpMessage.push(error.data[m][0]);
				}
				
	        	$scope.processing = false
		})
        
    
	};


    //array que contiene las caracteristicas de la aplicacion
	$scope.advantages = [

		{
			title: "Si Necesitas Aprender sobre tecnologia Te Va a Gustar Esto.",
			text: "En ComunidadAlpha.com tienes a tu disposicion más de 100 predicadores.",
			description: "Solo necesitas registrarte como usuario para tener acceso las 24 horas del dia, desde cualquier lugar y dispositivo, asi puedes ver que seminarios estan disponibles y lo mejor GRATIS!",
			img: "av1.jpg",
			alt: ""
		},
		{
			title: "Si Eres Profesional o tienes conocimientos de tecnologia Te Va a Gustar Esto.",
			text: "Registrandote en ComunidadAlpha.com tendras la posibilidad de compartir tus conocimientos",
			description: "Ser parte de esta comunidad te dara a conocer como profesional en el medio y puedes formar equipos de trabajo importantes para desarrollar proyectos tecnologicos a futuro.",
			img: "av2.jpg",
			alt: ""
		},
		{
			title: "A Todos Les Va a Gustar ComunidadAlpha.com",
			text: "Porque es una plataforma moderna agil y confiable",
			description: "Nuestra plataforma esta diseñada pensada y preparada para la vituaidad, esta enfocada en las nuevas tecnologias moviles, y pretende convertirce en la red social que comunique a quienes tienen el conocimiento y lo quieren compartir con personas que requieran mejorar sus conocomientos en tecnologia.",
			img: "av3.jpg",
			alt: "",
		}

	]

	//array que contiene los predicadores destacados
	$scope.preachers = [

		{
			name: "Jhon Doe Adesf.",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			img: "profile1.jpg",
			alt: ""
		},
		{
			name: "Jhon Doe A.",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing.",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			img: "profile2.jpg",
			alt: ""
		},
		{
			name: "Jhon Doe A.",
			text: "Lorem ipsum dolor sit amet.",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			img: "profile3.jpg",
			alt: "",
		},
		{
			name: "Jhon Doe A.",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			img: "profile4.jpg",
			alt: ""
		},
		{
			name: "Jhon Doe A.",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing.",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			img: "profile5.jpg",
			alt: ""
		},
		{
			name: "Jhon Doe A.",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do. ",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			img: "profile6.jpg",
			alt: "",
		}

	]
	
	//array que contiene los seminarios disponibles
	$scope.seminars = [

		{
			title: "Mi primera pagina web",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av1.jpg",
			alt: ""
		},
		{
			title: "Entorno de desarrollo avansado",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av2.jpg",
			alt: ""
		},
		{
			title: "NODE JS el futuro de la web",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av3.jpg",
			alt: "",
		},
		{
			title: "De CSS a SCSS cuales son sun ventajas",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av1.jpg",
			alt: ""
		},
		{
			title: 'Como ser un desarrollador web "FRELANCE" exitoso',
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av2.jpg",
			alt: ""
		},
		{
			title: "FrontEnd avansado",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av3.jpg",
			alt: "",
		},
		{
			title: "CoffeScript avansado",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av2.jpg",
			alt: ""
		},
		{
			title: "BackEnd Con PHP",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av3.jpg",
			alt: "",
		},
		{
			title: "Validacion y Verficacion De software",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av1.jpg",
			alt: ""
		},
		{
			title: 'Angular js El mejor Framaework de FrontEnd',
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av2.jpg",
			alt: ""
		},
		{
			title: "Ruby como alternativa de lenguaje moderno",
			text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			place: "fundacion universitaria luis amigo",
			hour: '06:00 pm',
			img: "av3.jpg",
			alt: "",
		}

	]

	$scope.noWrapSlides = true;
	$scope.myInterval = 10000;

	//logica que filtra y organiza las encuestas activas para mostrarlas de 3 en 3 en cada slide

	$scope.filterArray = function (num,array) {

		var filteredArray =[]

		while (array.length) {
			filteredArray.push(array.splice(-num))
		};
		return filteredArray;
	};

	$scope.filteredPreachers = $scope.filterArray(3,$scope.preachers)
	$scope.filteredSeminars = $scope.filterArray(6,$scope.seminars)

	// Para usar el html en angular
	$scope.sanitize = function (item) {
		if(!item) return
		return $sce.trustAsHtml(item);
	}

    /**
	 * muestra el modal de login
	 */
	$scope.showModalLogin = function () {

		$scope.modalLoginShow = true;
		$scope.declarateUser()
		$scope.sessionMessage = false;
		$scope.sessionSuccess = false;
	};

	/**
	 * se ejecuta cuando se cierra el modal de login
	 */
	$scope.closeModalLogin = function () {
		
	};

	/**
	 * muestra el modal de signup
	 */
	$scope.showModalSignup = function () {

		$scope.modalSignupShow = true;
		$scope.declarateNewUser();
	 	$scope.signUpMessage = false;
	 	$scope.signUpSuccess = false;
	};

	/**
	 * se ejecuta cuando se cierra el modal de Signup
	 */
	$scope.closeModalSignup = function () {
		
	};

	/**
	 * muestra el modal de recordar la contraseña
	 */
	$scope.showModalRemember = function () {
		$scope.modalRememberShow = true;
		$timeout(function(){    		
			$('#showModalRemember').trigger('click');
			$scope.form = {
				city: '',
				title: '',
				shortDescription: '',
				description: '',
			}
			$scope.sessionMessage = false;
			$scope.success = false;
	    },400)	
	};

	/**
	 * se ejecuta cuando se cierra el modal de recordar la contraseña
	 */
	$scope.closeModalRemember = function () {
		$scope.form = {
			city: '',
			title: '',
			shortDescription: '',
			description: '',
		}
		$scope.sessionMessage = false;
		$scope.success = false;
	};
})

.controller('PlatformCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[0];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 0;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 10;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('SpaceCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[0];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 0;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 2;//define lque sub menu(barra inferior) esta activo en el momento

	$scope.posts = [

		{
			title: "Sobre marcas, liderazgos y coaliciones",
			user: "Rondalla",
			date: "07/07/2015 21:23:27",
			text: 'Da la impresión de que esta encuesta sería perfectamente válida, o podría haber sido pensada y ejecutada en un ámbito político que podríamos definir com "España sin Euskadi-Navarra y sin Cataluña". En otras palabras...'
		},
		{
			title: "La búsqueda de novedad en el gobierno",
			user: "Camil41",
			date: "07/07/2015 21:23:27",
			text: 'podría haber sido pensada y ejecutada en un ámbito político que podríamos definir com "España sin Euskadi-Navarra y sin Cataluña". En otras palabras...'
		},
		{
			title: "Estatus Democracia",
			user: "Amanda",
			date: "07/07/2015 21:23:27",
			text: 'Da la impresión de que esta encuesta sería perfectamente válida, o podría haber sido pensada y ejecutada en un ámbito político que podríamos definir com "España sin Euskadi-Navarra y sin Cataluña". En otras palabras...'
		}

	]

})

.controller('DecisionsCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[0];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 0;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 0;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('HistoryCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[0];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 0;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 3;//define lque sub menu(barra inferior) esta activo en el momento

	/**
	 * muestra el modal
	 */
	$scope.showModalSeeHistory = function (item) {
		$scope.modalSeeHistoryShow = true;
		$scope.historySelected = item;
		
	};

})

.controller('FoundationsCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[1];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 1;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 10;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('ValuesCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[1];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 1;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 0;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('InitiativesCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[1];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 1;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 3;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('CollectiveCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[1];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 1;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 2;//define lque sub menu(barra inferior) esta activo en el momento

	$scope.team = [

		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		},
		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		},
		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		},
		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		}

	]

})

.controller('ToolsCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[3];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 3;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 10;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('DocumentsCtrl',function($scope,$http,$location,$rootScope){

	$rootScope.subMenus = $rootScope.subMenusList[3];//define los sub menus(barra inferior) que deben aparecer en la vista dinamica
	$rootScope.activeMenu = 3;//define lque menu(barra superior) esta activo en el momento
	$rootScope.activeSubMenu = 0;//define lque sub menu(barra inferior) esta activo en el momento

})

.controller('WhoCtrl',function($scope,$http,$location,$rootScope){

	//array que contiene los datos de el equipo de trabajo
	$scope.team = [

		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		},
		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		},
		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		},
		{
			title: "Fundador y Director Ejecutivo",
			name: "Javier Villamizar Ramírez, Ingeniero de Sistemas y Emprendedor",
			description: "Emprendedor, CEO de Spin Group Colombia, MSc en Ingeniería, formulador, estructurador y ejecutor de proyectos de inversión en Ciencia, Tecnología e Innovación. Responsable y autor de ideación de la aplicación, contenidos y objetivos del movimiento, director y diseñador de la arquitectura técnica y funcional de Alpha.",
			img: "",
			alt: ""
		}

	]

})


// *****************************************************************************
// Controlador de la vista de inicio
// *****************************************************************************
.controller('StartCtrl',function($scope,$http,$location,$rootScope,$sce,$timeout){
	$scope.initiatives = [];//declaramos las iniciativas vacias al inicio
	$scope.cities =['Bogotá -  Cundinamarca','Medellín -  Antioquia','Cali -  Valle del Cauca','Barranquilla -  Atlántico','Cartagena -  Bolívar','Cúcuta -  Norte de Santander','Soledad -  Atlántico','Ibagué -  Tolima','Bucaramanga -  Santander','Soacha -  Cundinamarca','Villavicencio -  Meta','Santa Marta -  Magdalena','Pereira -  Risaralda','Bello -  Antioquia','Valledupar -  Cesar','Montería -  Córdoba','Pasto -  Nariño','Buenaventura -  Valle del Cauca','Manizales -  Caldas','Neiva -  Huila','Palmira -  Valle del Cauca','Armenia -  Quindío','Popayán -  Cauca','Sincelejo -  Sucre','Itaguí -  Antioquia','Floridablanca -  Santander','Riohacha -  La Guajira','Envigado -  Antioquia','Tuluá -  Valle del Cauca','Tumaco -  Nariño','Dosquebradas -  Risaralda','Barrancabermeja -  Santander','Tunja -  Boyacá','Girón -  Santander','Apartadó -  Antioquia','Uribia -  La Guajira','Florencia -  Caquetá','Turbo -  Antioquia','Maicao -  La Guajira','Piedecuesta -  Santander','Yopal -  Casanare','Ipiales -  Nariño','Fusagasugá -  Cundinamarca','Cartago -  Valle del Cauca','Facatativá -  Cundinamarca','Chía -  Cundinamarca','Pitalito -  Huila','Magangué -  Bolívar','Zipaquirá -  Cundinamarca','Malambo -  Atlántico','Rionegro -  Antioquia','Jamundí -  Valle del Cauca','Lorica -  Córdoba','Yumbo -  Valle del Cauca','Quibdó -  Chocó','Buga -  Valle del Cauca','Sogamoso -  Boyacá','Duitama -  Boyacá','Caucasia -  Antioquia','Girardot -  Cundinamarca','Ciénaga -  Magdalena','Manaure -  La Guajira','Tierralta -  Córdoba','Ocaña -  Norte de Santander','Sabanalarga -  Atlántico','Santander de Quilichao -  Cauca','Aguachica -  Cesar','Cereté -  Córdoba','Sahagún -  Córdoba','Arauca -  Arauca','Villa del Rosario -  Norte de Santander','Garzón -  Huila','Mosquera -  Cundinamarca','Candelaria -  Valle del Cauca','Montelíbano -  Córdoba','Caldas -  Antioquia','Madrid -  Cundinamarca','Calarcá -  Quindío','La Dorada -  Caldas','Los Patios -  Norte de Santander','Espinal -  Tolima','Chigorodó -  Antioquia','Funza -  Cundinamarca','El Carmen de Bolívar -  Bolívar','Arjona -  Bolívar','Santa Rosa de Cabal -  Risaralda','Turbaco -  Bolívar','San Andrés -  San Andrés y Providencia','Copacabana -  Antioquia','Acacías -  Meta','San Vicente del Caguán -  Caquetá','Planeta Rica -  Córdoba','Chiquinquirá -  Boyacá','San José del Guaviare -  Guaviare','Ciénaga de Oro -  Córdoba','La Plata -  Huila','Corozal -  Sucre','Necoclí -  Antioquia','La Estrella -  Antioquia','Granada -  Meta','Riosucio -  Caldas','Zona Bananera -  Magdalena','Puerto Asís -  Putumayo','Florida -  Valle del Cauca','Plato -  Magdalena','Baranoa -  Atlántico','El Cerrito -  Valle del Cauca','Pamplona -  Norte de Santander','Fundación -  Magdalena','San Marcos -  Sucre','Cajicá -  Cundinamarca','Villamaría -  Caldas','Carepa -  Antioquia','El Banco -  Magdalena','Puerto Boyacá -  Boyacá','Pradera -  Valle del Cauca','Girardota -  Antioquia','Marinilla -  Antioquia','Tame -  Arauca','La Ceja -  Antioquia','Orito -  Putumayo','Sabaneta -  Antioquia','Valle del Guamuez -  Putumayo','Chinchiná -  Caldas','Ayapel -  Córdoba','Agustín Codazzi -  Cesar','San Onofre -  Sucre','Barbosa -  Antioquia',]//arreglo que contiene las ciudades disponibles para crear una nueva iniciativa
	$scope.userTypes =['Líder','Ejecutor']//arreglo que contiene los tipos de usuario 

	////se configura las estadisticas de los usuarios
	$scope.userLabels = ["Usuarios emprendedores", "Usuarios votantes", "Usuarios activos"];
	$scope.userStadistics = [0, 0, 0];

	//se configura las estadisticas de la encuesta principal
  	$scope.pollLabels = ['A', 'B', 'C', 'D', 'E'];
  	$scope.pollStadistics = [
		[0, 1, 0, 0, 0],
	];

	//contiene los datos para crear una nueva iniciativa
	$scope.form = {
		city: '',
		title: '',
		shortDescription: '',
		description: '',
	}

	//carga las iniciativas creadas en la base de datos
	$scope.loadInitiatives = function () {

		//peticion al servidor usando php
	    $http.post('start', [''])
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$location.path( "/login" );
			}else if(data['poll']) {

				  $scope.userName = data['userName']
				  $scope.avatar = data['avatar'] ? data['avatar'] : 'avatardefault.jpg'
				  $scope.isPoll = true;
				  $scope.poll.id = data['poll'];

			}else{
				if (data['initiatives'].length == 0) {
					$scope.initiatives = [{}]
					$scope.userName = data['userName']
				    $scope.avatar = data['avatar'] ? data['avatar'] : 'avatardefault.jpg'
				    $scope.userStadistics = data['userStadistics'];
				  	$scope.pollStadistics = [data['pollStadistics'][0]];
				 	$scope.otherAnswers = data['pollStadistics'][1];
				 	$scope.votesLabels = data['votesStadistics'][0];
				 	$scope.namesLabels = data['votesStadistics'][1];
				}else{

    			  $('.modal-backdrop ').hide()					
				  $scope.userName = data['userName']
				  $scope.avatar = data['avatar'] ? data['avatar'] : 'avatardefault.jpg'
				  $scope.initiatives = data['initiatives']
				  $scope.userStadistics = data['userStadistics'];
				  $scope.pollStadistics = [data['pollStadistics'][0]];
				  $scope.otherAnswers = data['pollStadistics'][1];
				  $scope.votesLabels = data['votesStadistics'][0];
				  $scope.namesLabels = data['votesStadistics'][1];
				};
			};


	    })

	    .error(function(data)
	    {
	    	$scope.success = '<span class="is-error bold-600">!Ocurrio un error </span>por favor abrir el enlace directamente del correo o verficar que copie y pegue la direccion completa'
	    });
    };
    $(window).focus(function(){
    });

     /*$(window).mousemove(function(){
     	var date = new Date();
	    });*/

    $timeout(function(){
	    }, 100)

    $scope.loadInitiatives();

	$scope.initiativeSelected = '';

	$scope.search = function() {		

		$scope.isSearch = true;
    }

     //selecciona la iniciativa filtrada
    $scope.selectInitiative = function(initiative){
    	$scope.initiativeSelected = initiative.title  
    	$scope.isSearch = false;
    	
    }


    /**
	 * muestra el modal
	 */
	$scope.showModal = function () {
		$scope.modalShow = true;
		$scope.form = {
			city: '',
			title: '',
			shortDescription: '',
			description: '',
		}
		$scope.sessionMessage = false;
		$scope.success = false;
	};

	/**
	 * se ejecuta cuando se cierra el modal el modal
	 */
	$scope.closeModal = function () {
		$scope.form = {
			city: '',
			title: '',
			shortDescription: '',
			description: '',
		}
		$scope.sessionMessage = false;
		$scope.success = false;
	};

	 

	$scope.createInitiative = function () {

		if($scope.form.shortDescription.length > 100 || $scope.form.title.length > 40) return
			$scope.processing = true

		//peticion al servidor usando php
        $http.post('initiative', $scope.form)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.sessionMessage = data['error']
    		}else if(data['success']){
    			$scope.sessionMessage = false
    			//$scope.loadInitiatives();
    			$scope.modalShow = false;
    			location.reload();
    		}

    		$scope.processing = false

        })
        .error(function(data)
        {       	
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}

        	$scope.processing = false

        });
		
	};

	//arreglo que contiene los datos de la entrevista
	$scope.poll = {
		userType: '',
		question: '',
		other: '',
		id: ''

	}

	//envia los datos de la entrevista ala base de datos
	$scope.sendPoll = function () {

		$scope.processing = true
		//peticion al servidor usando php
        $http.post('initialPoll', $scope.poll)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.sessionMessage = data['error']
    		}else if(data['success']){
    			$scope.sessionMessage = false
    			$('#modalInitialPoll').modal('hide')
    			location.reload();
				$scope.poll = {
					userType: '',
					question: '',
					other: '',
				}

    		}

    		$scope.processing = false

        })
        .error(function(data)
        {
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}

        	$scope.processing = false
        });
		
	};

	//apoyar una iniciativa
    $scope.support = function (item) {

    	if (item.supportingDisabled) return;
    	item.checkSupport = true
    	item.supportingDisabled = true

		//peticion al servidor usando php
        $http.post('support', item)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		item.supportingDisabled = false
    		}else if(data['success']){

    			item.supportingDisabled = true
    			item.votes++
    			
    		}

        		item.checkSupport = false


        })
        .error(function(data)
        {
        	$scope.sessionMessage = 'Por favor ingrese todos los datos'
        	item.supportingDisabled = false
        });
		
	};
	/**
	 * muestra el modal para ampliar la informacion de una iniciativa
	 */
	$scope.seeInitiative = function (item) {

		item.checkSupport = true
		$scope.detailInitiative = item;
		$scope.modalSeeInitiativeShow = true;
	};

	
	//cierra la actual sesion
    $scope.logOut = function () {

    	$scope.logOut = true

		//peticion al servidor usando php
        $http.post('logout', [''])
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.sessionMessage = data['error']
    		}else if(data['success']){
    			$scope.loadInitiatives();
    			
    		}

        })
        .error(function(data)
        {
        	$scope.sessionMessage = 'Por favor ingrese todos los datos'
        });
		
	};




	

})
