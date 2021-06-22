function checkCollision() {
        collisionW = false;
        collisionS = false;
        collisionA = false;
        collisionD = false;

        var originPoint = player.position.clone();

        var localVertex = new THREE.Vector3();
        var position = player.geometry.attributes.position;
        var nVertices = position.count;
        for (var vertexIndex = 0; vertexIndex < nVertices; vertexIndex++) {
            // we take the vertices of the player
            localVertex.fromBufferAttribute( position, vertexIndex );
            var globalVertex = localVertex.applyMatrix4(player.matrix);
            var directionVector = globalVertex.sub(player.position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(obstacles);
            if(collisionResults.length > 0){
              for(var collisionNumber = 0; collisionNumber < collisionResults.length; collisionNumber++){
                if(collisionResults[collisionNumber].distance < directionVector.length()){
                  console.log("sono qui", collisionNumber);
                  axesCollision = collisionResults[collisionNumber].face.normal;
                  if(Math.round(axesCollision.x) == 1) {collisionA = true;}
                  if(Math.round(axesCollision.x) == -1) {collisionD = true;}
                  if(Math.round(axesCollision.z) == 1) {collisionW = true;}
                  if(Math.round(axesCollision.z) == -1) {collisionS = true;}
                }
              }
            }
        }
}
