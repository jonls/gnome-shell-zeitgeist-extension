const St = imports.gi.St;
const Dash = imports.ui.dash;
const Main = imports.ui.main;
const Lang = imports.lang;
const DashItemContainer = Dash.DashItemContainer;
const IconGrid = imports.ui.iconGrid;
const AppDisplay = imports.ui.appDisplay;

function AppLauncherIcon () {
    this._init();
}

AppLauncherIcon.prototype = {
    _init: function() {
        this.actor = new St.Button({ style_class: 'app-well-app',
                                     reactive: true,
                                     button_mask: St.ButtonMask.ONE | St.ButtonMask.TWO,
                                     can_focus: true,
                                     x_fill: true,
                                     y_fill: true });
        this.actor._delegate = this;
        this.icon = new IconGrid.BaseIcon(_("AppLauncher"),
                                           { setSizeManually: true,
                                             showLabel: false,
                                             createIcon: Lang.bind(this, this.createIcon) });
        this.actor.set_child(this.icon.actor);
        this.actor.label_actor = this.icon.label;
    },
    
    createIcon: function (size) {
        this._iconActor = new St.Icon({ icon_name: 'view-grid-symbolic',
                                        style_class: 'app-well-app',
                                        icon_size: size });
        return this._iconActor;
    },
}

function AppLauncher () {
    this._init();
}

AppLauncher.prototype = {
    _init: function() {
        this.iconSize = 16;
        this.display = new AppLauncherIcon();
        this.dashItem = new DashItemContainer();
        
        this.actor = this.dashItem.actor;
        this.dashItem.setChild(this.display.actor);

        this.display.icon.setIconSize(this.iconSize);
        this._toggled = false;
        
        this.display.actor.connect('clicked', Lang.bind(this, this._onButtonPress));
    },

    setActive: function (active) {
        if (active == true) {
            Main.overview._viewSelector.switchTab("applications");
            this.display.actor.add_style_class_name('running');
        }
        else if (active == false) {
            Main.overview._viewSelector.switchTab("windows");
            this.display.actor.remove_style_class_name('running');
        }
        this._toggled = active;
        this.display.actor.set_checked(active);
    },

    _onButtonPress: function(actor, event) {
        this.setActive (!this._toggled);
    },


    setHover: function(hovered) {
        this._iconBin.set_hover(hovered);
        if (this._iconActor)
            this._iconActor.set_hover(hovered);
    },

    // Rely on the dragged item being a favorite
    handleDragOver: function(source, actor, x, y, time) {
        return DND.DragMotionResult.MOVE_DROP;
    },

    acceptDrop: function(source, actor, x, y, time) {
        let app = null;
        if (source instanceof AppDisplay.AppWellIcon) {
            let appSystem = Shell.AppSystem.get_default();
            app = appSystem.lookup_app(source.getId());
        } else if (source.metaWindow) {
            let tracker = Shell.WindowTracker.get_default();
            app = tracker.get_window_app(source.metaWindow);
        }

        let id = app.get_id();

        Meta.later_add(Meta.LaterType.BEFORE_REDRAW, Lang.bind(this,
            function () {
                AppFavorites.getAppFavorites().removeFavorite(id);
                return false;
            }));

        return true;
    }
};
