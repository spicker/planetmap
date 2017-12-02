var canvas = null;

function addEventListeners(c) {
    canvas = c;

    window.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
}

function onWindowResize() {
    let width = window.innerWidth,
        height = window.innerHeight;
    canvas.camera.aspect = width / height;
    canvas.camera.updateProjectionMatrix();
    canvas.renderer.setSize(width, height);
}

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    canvas.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    canvas.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    canvas.updateHighlight(canvas.raycast(), false);
}

function onDocumentMouseDown(event) {
    canvas.updateHighlight(canvas.raycast(), true);
}

const AU = 149597870.7

export {
    addEventListeners,
    AU
};