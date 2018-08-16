function Router() {
    this.routes = {};
    this.currentUrl = '';
}
Router.prototype.constructor = Router;
Router.prototype.route = function (path,callback) {
    this.routes[path] = callback || function () {};
};
Router.prototype.refresh = function () {
    this.currentUrl = location.hash.slice(1) || '/';
    this.routes[this.currentUrl]();
};
Router.prototype.init = function () {
    window.addEventListener("load",this.refresh.bind(this),false);
    window.addEventListener("hashchange",this.refresh.bind(this),false);
};

var router = new Router();
router.init();

var content = document.querySelector("body");
function changeBgColor(color) {
    content.style.background = color;
}

router.route('/',function () {
    changeBgColor('white');
});
router.route('/orange',function () {
    changeBgColor('orange');
});
router.route('/purple',function () {
    changeBgColor('purple');
});