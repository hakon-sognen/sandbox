        var scene, renderer;
        var camera, controls, gui, tween,marker;


       

        var clickInfo = {
            x: 0,
            y: 0,
            userHasClicked: false
        };


        var uniforms = {
          time: {
            type: 'f', // a float
            value: 0
          }
       
        };

        var uniforms2 = {
          time: {
            type: 'f', // a float
            value: 0
          }
        };


        if( !init() )   animate();

        // init the scene
        function init(){

            if( Detector.webgl ){
                renderer = new THREE.WebGLRenderer({
                    antialias       : true, // to get smoother output
                    preserveDrawingBuffer   : true  // to allow screenshot
                });
                renderer.setClearColorHex( 0xBBBBBB, 1 );
            // uncomment if webgl is required
            //}else{
            //  Detector.addGetWebGLMessage();
            //  return true;
            }else{
                renderer    = new THREE.CanvasRenderer();
            }
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.getElementById('container').appendChild(renderer.domElement);

            
            
            document.getElementById('container').addEventListener('click', function (evt) {
            // The user has clicked; let's note this event
            // and the click's coordinates so that we can
            // react to it in the render loop
            clickInfo.userHasClicked = true;
            clickInfo.x = evt.clientX;
            clickInfo.y = evt.clientY;
        }, true);
            
            

            // create a scene
            scene = new THREE.Scene();

            // put a camera in the scene
            camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.set(800, 200, 800);
            scene.add(camera);

            // create a camera contol
            controls = new THREE.OrbitalControls(camera)



            // transparently support window resize
            THREEx.WindowResize.bind(renderer, camera);
            
             marker = new THREE.Mesh( new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial( { color: 0xff0000 } ) );
             scene.add(marker);
            
            setupGui();
            
            setupContent();
          
        
           
    
        }
        
       


        // animation loop
        function animate() {

            // loop on request animation loop
            // - it has to be at the begining of the function
            // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
            requestAnimationFrame( animate );

            // do the render
            render();

         
        }

        // render the scene
        function render() {

            // update camera controls
            controls.update();

            TWEEN.update();

            uniforms.time.value+=0.001;
            uniforms2.time.value+=0.001;
           
            pick();
           
            // actually render the scene
            renderer.render( scene, camera );
        }

    function pick(){
        
              if (clickInfo.userHasClicked) {

               
                var projector = new THREE.Projector();
                 var directionVector = new THREE.Vector3();


                    clickInfo.userHasClicked = false;
        
                 //   statsNode.innerHTML = '';
       
                    // The following will translate the mouse coordinates into a number
                    // ranging from -1 to 1, where
                    //      x == -1 && y == -1 means top-left, and
                    //      x ==  1 && y ==  1 means bottom right
                    var x = ( clickInfo.x / window.innerWidth ) * 2 - 1;
                    var y = -( clickInfo.y / window.innerHeight ) * 2 + 1;
                  
                
                  
                    // Now we set our direction vector to those initial values
                    directionVector.set(x, y, 1);
        
                    // Unproject the vector
                    projector.unprojectVector(directionVector, camera);
        
                    // Substract the vector representing the camera position
                    directionVector.subSelf(camera.position);
        
                    // Normalize the vector, to avoid large numbers from the
                    // projection and substraction
                    directionVector.normalize();
        
                    // Now our direction vector holds the right numbers!
                    ray.setSource(camera.position, directionVector);
        
                    var intersects = ray.intersectObjects(scene.children);
                    if (intersects.length) {
                        // intersections are, by default, ordered by distance,
                        // so we only care for the first one. The intersection
                        // object holds the intersection point, the face that's
                        // been "hit" by the ray, and the object to which that
                        // face belongs. We only care for the object itself.
                        var target = intersects[0].object;
                      //  statsNode.innerHTML = 'Name: ' + target.name
                         //       + '<br>'
                         //       + 'ID: ' + target.id;
        
                        // let's move the marker to the hit point
                        marker.position.x = intersects[0].point.x;
                        marker.position.y = intersects[0].point.y;
                        marker.position.z = intersects[0].point.z;
                    }

        }
        
        
    }

        

        function setupGui(){
            
            gui = new dat.GUI();

            
            var Params = function() {
                this.message = 'dat.gui';
                this.speed = 0.8;
                this.doit = false;
                this.explode = function() {  };      
            };
            
            var params = new Params();
            
                
            gui.add(params,'message');
            gui.add(params,'speed');
            gui.add(params,'doit');
            gui.add(params,'explode').onFinishChange(function(){
                console.log("Explode");           
                tween.start();
           
            });               

            
            
        }

        function setupContent(){
          
          
          var light = new THREE.DirectionalLight(0xFFFFFF,0.3);
            light.position.set(1,-1,1);
            light.rotation.x = light.rotation.y = light.rotation.z = 0;
          //  light.target.position.set(0.0,0.0,0.0);
          //  light.target.updateMatrixWorld();
            scene.add(light);
        
            var ambient = new THREE.AmbientLight( 0x808080 );
            scene.add(ambient);
                  
            var material2 = new THREE.MeshNormalMaterial();
            var material = new THREE.MeshLambertMaterial({
               
                side: THREE.DoubleSide
                
                
            });
       
        var noiseShader = $('#noise').text();
       
       
   
      
       
       
        // create the sphere's material
        var shaderMaterial = new THREE.ShaderMaterial({
   
            uniforms: uniforms,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: noiseShader+$('#fragmentshader').text(),
            side: THREE.DoubleSide
        });

        var shaderMaterial2 = new THREE.ShaderMaterial({
            uniforms: uniforms2,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: noiseShader+$('#fragmentshader2').text(),
            side: THREE.DoubleSide
        });

       
       
          var material =  new THREE.MeshLambertMaterial({
               side: THREE.DoubleSide
              
          });
       
         //   material.side = THREE.FlipSided;
            var skyboxMesh  = new THREE.Mesh( new THREE.SphereGeometry( 3000, 48, 32 ), shaderMaterial2 );
           
           // material.doubleSided = true;
            // add it to the scene
            scene.add( skyboxMesh );
            
            var mesh = new THREE.Mesh( new THREE.CubeGeometry( 30, 10, 10 ), shaderMaterial );
          
          
          
            mesh.position.y=5;
            scene.add( mesh );
    
            var wireframeMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(0x000000) , wireframe : true, linewidth: 5} );
    
            var mesh2 = new THREE.Mesh( new THREE.CubeGeometry( 30, 10, 10 ), wireframeMaterial );
          
          
          
            mesh2.position.y=5;

            scene.add( mesh2 );
    
    
            var planeW = 50; // pixels
            var planeH = 50; // pixels 
            var numW = 50; // how many wide (50*50 = 2500 pixels wide)
            var numH = 50; // how many tall (50*50 = 2500 pixels tall)
            var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new THREE.MeshBasicMaterial( { color: new THREE.Color(0x00ff00) , wireframe : true, linewidth: 5} )  );
            plane.rotation.x =  Math.PI/2;
            scene.add(plane);
    
            var grassBase =  new THREE.Color(0x44aa44);
            var current = { x: mesh.position.y };
           
            
            tween = new TWEEN.Tween({ x: -20 }).to({ x: 20 },10); ;
                       
            
            tween.onUpdate(function(){
               
                mesh.position.y = current.x;
                console.log(current.x);
          
            });
               var stride = 3;
            var h = 0.1;
              var geometry = new THREE.Geometry;
                    geometry.vertices.push(
                       new THREE.Vector3(0, h, 0),
                       new THREE.Vector3(stride, h, 0),
                       new THREE.Vector3(stride, h, stride),
                       new THREE.Vector3(0, h, stride),
                       new THREE.Vector3(0, h, 0)
                    //  ,new THREE.Vertex(new THREE.Vector3(0, 0, 0))//,
                        //new THREE.Vertex(new THREE.Vector3(2.5, 2, 0)),
                        //new THREE.Vertex(new THREE.Vector3(5, 0, 0))
                    );
                    geometry.colors = [
                        new THREE.Color(0x00ff00),
                        new THREE.Color(0x00ff00),                    
                        new THREE.Color(0x00ff00),
                        new THREE.Color(0x00ff00),
                        new THREE.Color(0x00ff00),
                    ];
    
            material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3 } );
            material.vertexColors = true;
            
            var group = new THREE.Object3D();
            scene.add(group);
          
            var grassSize = 100; 
          
            group.position.x=-grassSize*0.5;
            group.position.z=-grassSize*0.5;
            
            
            var underGrass = new THREE.Mesh( new THREE.PlaneGeometry( grassSize, grassSize), new   THREE.MeshBasicMaterial( { color: grassBase , wireframe : true} ) );
            underGrass.z = 1;
            underGrass.rotation.x =  -Math.PI/2;
            scene.add(underGrass);
            
            for(var i = 0; i < grassSize ; i+=6){
                for(var j = 0; j < grassSize ; j+=6){
                  
    
                    var line = new THREE.Line(geometry, material);
                
                    line.position.x=i+Math.random();
                    line.position.z=j+Math.random();
                    group.add(line);
                }
            }
            
            var points = [];
           
            points.push(new THREE.Vector3(0, 0, 0));
            points.push(new THREE.Vector3(0, 50, 0));
            points.push(new THREE.Vector3(50, 50, 0));
            points.push(new THREE.Vector3(50, 0, 0));
            points.push(new THREE.Vector3(0, 0, 0));
            points.push(new THREE.Vector3(-25, 0, 0));
            points.push(new THREE.Vector3(-50, 0, 50));
            points.push(new THREE.Vector3(50, 0, 50));
            points.push(new THREE.Vector3(50, 0, -50));
            points.push(new THREE.Vector3(50, 0, -500));
            var extrudePath = new THREE.SplineCurve3(points);
            var segments = 50;
            var radiusSegments = 12;
            var radius = 4;
            var tubeGeom = new THREE.TubeGeometry(extrudePath,segments,radius,radiusSegments,false,false);
            
            var tubeMesh = new THREE.Mesh(tubeGeom,shaderMaterial);
            
            var tubeMeshWf = new THREE.Mesh(tubeGeom,wireframeMaterial);
            
            scene.add(tubeMesh);
            scene.add(tubeMeshWf);
        }
    

