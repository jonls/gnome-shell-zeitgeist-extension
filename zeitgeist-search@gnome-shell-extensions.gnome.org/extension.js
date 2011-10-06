
/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
	
/* JournalDisplay object to show a timeline of the user's past activities
 *
 * This file exports a JournalDisplay object, which carries a JournalDisplay.actor.
 * This is a view of the user's past activities, shown as a timeline, and
 * whose data comes from what is logged in the Zeitgeist service.
 */

/* Style classes used here:
 *
 * journal - The main journal layout
 *     item-spacing - Horizontal space between items in the journal view
 *     row-spacing - Vertical space between rows in the journal view
 *
 * journal-heading - Heading labels for date blocks inside the journal
 *
 * .journal-item .overview-icon - Items in the journal, used to represent files/documents/etc.
 * You can style "icon-size", "font-size", etc. in them; the hierarchy for each item is
 * is StButton -> IconGrid.BaseIcon
 */

const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Pango = imports.gi.Pango;
const Shell = imports.gi.Shell;
const Lang = imports.lang;
const Signals = imports.signals;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Gettext = imports.gettext.domain('gnome-shell');
const _ = Gettext.gettext;
const C_ = Gettext.pgettext;

const ContactDisplay = imports.ui.contactDisplay;
const PlaceDisplay = imports.ui.placeDisplay;

const Extension = imports.ui.extensionSystem.extensions["zeitgeist-search@gnome-shell-extensions.gnome.org"];

const Main = imports.ui.main;
const Util = imports.misc.util;
const DocInfo = Extension.docInfo;
const Semantic = Extension.semantic;
const Zeitgeist = Extension.zeitgeist;
const ZeitgeistSearch = Extension.zeitgeistSearch;

function init(metadata)
{
}

function enable() {
    
    var searchProviders = Main.overview._viewSelector._searchTab._searchSystem._providers;
    
    for (var i = 0; i < searchProviders.length; i++) {
        log(searchProviders[i].title);
        Main.overview._viewSelector._searchTab.removeSearchProvider(searchProviders[i]);
        i--;
    }
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.AppAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.SettingsAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new PlaceDisplay.PlaceSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.DocumentsAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.VideosAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.MusicAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.PicturesAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ZeitgeistSearch.OtherAsyncSearchProvider());
    Main.overview._viewSelector.addSearchProvider(new ContactDisplay.ContactSearchProvider());
}

function disable() {
    
}

// TODO
//
// * Make icons reactive; single-click or right-click to get a Largo-like set of actions; double-click to launch
//     Open with...
//     Show in file manager
//     --------------------
//     Remove from journal
//     Move to trash
//
// * Sort events when we get them (hmm, maybe Zeitgeist already does that for us)
//
// * isearch like in Emacs
//
// * Big Fat Eraser mode, like in gnome-activity-journal
//

// Each Query will generate a ResultSection
//
// Each ResultSection has a JournalLayout, which is populated by a LayoutBy*
//
// MAKE A DRAWING OF THIS - does it look pretty?
