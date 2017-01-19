/**
 * ie 版本判断
 */


// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
//     ie === undefined
// If you're in IE (>=5) then you can determine which version:
//     ie === 7; // IE7
// Thus, to detect IE:
//     if (ie) {}
// And to detect the version:
//     ie === 6 // IE6
//     ie > 7 // IE8, IE9 ...
//     ie < 9 // Anything less than IE9
// ----------------------------------------------------------

// UPDATE: Now using Live NodeList idea from @jdalton

/**
 * 注释
 var ie = (function(){

        var undef, v = 3, div = document.createElement('div');

        // the while loop is used without an associated block: {}
        // so, only the condition within the () is executed.

        // semicolons arent allowed within the condition,
        //   so a comma is used to stand in for one
        // basically allowing the two separate statements
        //   to be evaluated sequentially.

        while (
            div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
            div.getElementsByTagName('i')[0]
        );

        // each time it's evaluated, v gets incremented and
        //   tossed into the DOM as a conditional comment
        // the i element is then a child of the div.

        // the return value of the getEBTN call is used as
        //   the final condition expression
        // if there is an i element (the IE conditional
        //   succeeded), then getEBTN's return is truthy
        // and the loop continues until there is no
        //   more i elements.

        // In other words:  ** MAGIC**

        return v > 4 ? v : undef;

    }());
 */

var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );

    return v > 4 ? v : undef;

}());