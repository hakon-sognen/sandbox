        var scene, renderer,things;
        var camera, controls, gui, tween,marker;

        var cameraNode;
       

        var clickInfo = {
            x: 0,
            y: 0,
            userHasMoved: false,
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

        var terrainUniforms;
        
 
        var clock = new THREE.Clock();

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

            
            
            document.getElementById('container').addEventListener('mousemove', function (evt) {
            // The user has clicked; let's note this event
            // and the click's coordinates so that we can
            // react to it in the render loop
            clickInfo.userHasMoved = true;
            clickInfo.x = evt.clientX;
            clickInfo.y = evt.clientY;
        }, true);
            
           
            document.getElementById('container').addEventListener('mousedown', function (evt) {
            // The user has clicked; let's note this event
            // and the click's coordinates so that we can
            // react to it in the render loop
            clickInfo.userHasMoved = true;
            clickInfo.userHasClicked = true;
            clickInfo.x = evt.clientX;
            clickInfo.y = evt.clientY;
        }, true);
            
            

            // create a scene
            scene = new THREE.Scene();

            // put a camera in the scene
            camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 30000 );
            camera.position.set(100, 10, 100);
          
            cameraNode = new THREE.Object3D();         
            cameraNode.add(camera);
            scene.add(cameraNode);
            
            cameraNode.position.set(0, 0, 0);
            
            // create a camera contol
            controls = new THREE.OrbitalControls(camera)
            //controls = new THREE.PointerLockControls(camera);
           // scene.add( controls.getObject() );
            //controls.enabled=true;
            // transparently support window resize
            THREEx.WindowResize.bind(renderer, camera);
            
            marker = new THREE.Mesh( new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
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
          var delta = clock.getDelta()
            // update camera controls
            controls.update(delta);

            TWEEN.update();

            uniforms.time.value+=0.001;
            uniforms2.time.value+=0.001;
           
            terrainUniforms.time.value+=1.0;
           
           
            pick();
           
            // actually render the scene
            renderer.render( scene, camera );
        }
        var projector = new THREE.Projector();
        var directionVector = new THREE.Vector3();
        function pick(){
        
          if (clickInfo.userHasMoved) {


               
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
  
   
        
        
                    var ray = new THREE.Ray( camera.position, directionVector.subSelf( camera.position ).normalize() );

        
                    var intersects = ray.intersectObjects(things.children);
                    if (intersects.length) {
                        // intersections are, by default, ordered by distance,
                    // so we only care for the first one. The intersection
                    // object holds the intersection point, the face that's
                    // been "hit" by the ray, and the object to which that
                    // face belongs. We only care for the object itself.
                
                    for(var i=0; i < intersects.length;i++){                        
                        var target = intersects[i].object;                        
                        if(target.name.length>0){
                          //  console.log(target.name+" x:"+intersects[i].point.x+" y:"+intersects[i].point.y+" z:"+intersects[i].point.z);
                            //  statsNode.innerHTML = 'Name: ' + target.name
                            //       + '<br>'
                            //       + 'ID: ' + target.id;        
                            // let's move the marker to the hit point
                            marker.position.x = intersects[i].point.x;
                            marker.position.y = intersects[i].point.y;
                            marker.position.z = intersects[i].point.z;
                           
                          if (clickInfo.userHasClicked) {
                              
                              controls.targetOffset.set(marker.position.x, marker.position.y,marker.position.z);
                            }
                           
                            clickInfo.userHasMoved = false;
                            clickInfo.userHasClicked = false;
                            return;
                        }
                    }                                        
                }
        }                
    clickInfo.userHasMoved = false;
    clickInfo.userHasClicked = false;
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
       
   

        var skyboxMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms2,
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: noiseShader+$('#fragmentshader2').text(),          
            side: THREE.DoubleSide
        });

       
       
         
            //   material.side = THREE.FlipSided;
            var skyboxMesh  = new THREE.Mesh( new THREE.SphereGeometry( 6000, 16, 16 ), skyboxMaterial );
            skyboxMesh.flipSided = true;
            // material.doubleSided = true;
            // add it to the scene
            scene.add( skyboxMesh );
               
           
             things = new THREE.Object3D();
            things.position.x=-50;
            things.position.z=-50;
            scene.add( things );
            
            var boxMaterial = new THREE.ShaderMaterial({   
                uniforms: uniforms,
                vertexShader:   $('#vertexshader').text(),
                fragmentShader: noiseShader+$('#fragmentshader').text(),
                side: THREE.DoubleSide
            });
            
            var mesh = new THREE.Mesh( new THREE.CubeGeometry( 100, 11, 10 ), material );
            mesh.name="box";
          
          
            mesh.position.y=-5;
            things.add( mesh );
    
            var wireframeMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(0x000000) , wireframe : true, linewidth: 5} );
    
            var mesh2 = new THREE.Mesh( new THREE.CubeGeometry( 100, 11, 10 ), wireframeMaterial );
          
          
          
            mesh2.position.y=-5;

            things.add( mesh2 );
    
    
            var planeW = 50; // pixels
            var planeH = 50; // pixels 
            var numW = 50; // how many wide (50*50 = 2500 pixels wide)
            var numH = 50; // how many tall (50*50 = 2500 pixels tall)
            var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new THREE.MeshBasicMaterial( { color: new THREE.Color(0x00ff00) , wireframe : true, linewidth: 5} )  );
            plane.rotation.x =  Math.PI/2;
            things.add(plane);
    
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
                        new THREE.Color(0x0f0f0f),
                        new THREE.Color(0x0f0f0f),                    
                        new THREE.Color(0x0f0f0f),
                        new THREE.Color(0x0f0f0f),
                        new THREE.Color(0x0f0f0f),
                    ];
    
            material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3 } );
            material.vertexColors = true;
            
            var group = new THREE.Object3D();
            things.add(group);
          
            var grassSize = 100; 
          
            group.position.x=-grassSize*0.5;
            group.position.z=-grassSize*0.5;
            
            
            var underGrass = new THREE.Mesh( new THREE.PlaneGeometry( grassSize, grassSize), new THREE.MeshBasicMaterial( { color: grassBase , wireframe : true} ) );
            underGrass.z = 1;
            underGrass.rotation.x =  -Math.PI/2;
            things.add(underGrass);
            
            for(var i = 0; i < grassSize ; i+=6){
                for(var j = 0; j < grassSize ; j+=6){
                  
    
                    var line = new THREE.Line(geometry, material);
                
                    line.position.x=i;
                    line.position.z=j;
                    group.add(line);
                }
            }
            
            var points = [];
           
            points.push(new THREE.Vector3(75, -6, 0));
            points.push(new THREE.Vector3(70, 6, 0));
            points.push(new THREE.Vector3(50, 3, 0));
            points.push(new THREE.Vector3(0, 3, 0));
            points.push(new THREE.Vector3(-50, 3, 0));
            points.push(new THREE.Vector3(-70, 6, 0));
            points.push(new THREE.Vector3(-75, -6, 0));
           
            //points.push(new THREE.Vector3(50, 0, 0));
            //points.push(new THREE.Vector3(0, 0, -12));
            //points.push(new THREE.Vector3(-25, 0, 0));
            //points.push(new THREE.Vector3(-50, 0, 50));

            var extrudePath = new THREE.SplineCurve3(points);
            var segments = 50;
            var radiusSegments = 40;
            var radius = 4;
            var tubeGeom = new THREE.TubeGeometry(extrudePath,segments,radius,radiusSegments,false,false);
           
           
           
           
           
            var tubeMaterial = new THREE.ShaderMaterial({   
                uniforms: uniforms,
                vertexShader:   $('#vertexshader').text(),
                fragmentShader: noiseShader+$('#fragmentshader').text(),
                side: THREE.DoubleSide
            });
            
            var tubeMesh = new THREE.Mesh(tubeGeom,tubeMaterial);
            tubeMesh.name="tube";
            var tubeMeshWf = new THREE.Mesh(tubeGeom,wireframeMaterial);
            
            things.add(tubeMesh);
            things.add(tubeMeshWf);
      
      
      
            var data = generateHeight( 1024, 1024,0,0 );
          

            var quality = 16, step = 1024 / quality;

            var plane = new THREE.PlaneGeometry( 1000, 1000, quality - 1, quality - 1 );
            plane.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

            var clearing = new THREE.Vector3(0.0,0.0,0.0);          
            
            for ( var i = 0, l = plane.vertices.length; i < l; i ++ ) {

                var x = i % quality, y = ~~ ( i / quality );
               
               
                 if(clearing.distanceTo(plane.vertices[ i ]) < 150 ){
                     data[ ( x * step ) + ( y * step ) * 1024 ]=64;
                 }
               
               
                plane.vertices[ i ].y = data[ ( x * step ) + ( y * step ) * 1024 ] * 1 - 64;

               
            }
          
            var texture = new THREE.Texture( generateTexture( data, 1024, 1024 ) );
            texture.needsUpdate = true;

            var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );


            terrainUniforms = {
                  time: {
                    type: 'f', // a float
                    value: 0.0
                  },
              
               my_texture: {
                    type: 't', // a float
                    value: texture
                  },
                
                uCamPos: {
                    type: 'v3',
                    value: camera.position
                    
                }
                
                
                };

            var terrainMaterial = new THREE.ShaderMaterial({   
                          
                uniforms: terrainUniforms,
                vertexShader:   $('#grassshader').text(),
                fragmentShader: noiseShader+$('#grassfragmentshader').text()
               
            });



            plane.computeCentroids();

            var terrainMesh = new THREE.Mesh( plane, terrainMaterial );
            // terrainMesh.name="Terrain";
            scene.add( terrainMesh );
      
      
        }
    

            function generateHeight( width, height, offW,offH ) {

                var data = Float32Array ? new Float32Array( width * height ) : [], perlin = new ImprovedNoise(),
                size = width * height, quality = 2, z = 0;

                for ( var i = 0; i < size; i ++ ) {

                    data[ i ] = 0

                }

                for ( var j = 0; j < 4; j ++ ) {
                    quality *= 4;
                    for ( var i = 0; i < size; i ++ ) {
                        
                        var x = i % width, y = ~~ ( i / width );
                        data[ i ] += Math.floor( Math.abs( perlin.noise( offW+x / quality, y / quality, offH+z / quality ) * 0.5 ) * quality + 10 );
                    
                    
                    }

                }

                return data;

            }


            function generateTexture( data, width, height ) {

                var canvas, context, image, imageData,
                level, diff, vector3, sun, shade;

                vector3 = new THREE.Vector3( 0, 0, 0 );

                sun = new THREE.Vector3( 1, 1, 1 );
                sun.normalize();

                canvas = document.createElement( 'canvas' );
                canvas.width = width;
                canvas.height = height;

                context = canvas.getContext( '2d' );
                context.fillStyle = '#000';
                context.fillRect( 0, 0, width, height );

                image = context.getImageData( 0, 0, width, height );
                imageData = image.data;


                shade = 0;


                for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++  ) {

                    vector3.x = data[ j - 1 ] - data[ j + 1 ];
                    vector3.y = 2;
                    vector3.z = data[ j - width ] - data[ j + width ];
                    vector3.normalize();

                    shade = vector3.dot( sun );
                    
                    var adjR = -60;
                    var adjG = 10;
                    var adjB = 32;

                    imageData[ i ] = ( adjR+96 + shade * 128 ) * ( data[ j ] * 0.007 );
                    imageData[ i + 1 ] = ( adjG+32 + shade * 96 ) * ( data[ j ] * 0.007 );
                    imageData[ i + 2 ] = ( adjB+shade * 96 ) * ( data[ j ] * 0.007 );

                }

                context.putImageData( image, 0, 0 );

                return canvas;

            }





