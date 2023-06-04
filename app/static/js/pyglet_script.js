// Pyglet JavaScript code
function run_pyglet_app() {
    var window = new pyglet.window.Window({ width: 800, height: 600 });

    window.on("draw", function() {
        window.clear();
    });

    pyglet.app.run();
}
