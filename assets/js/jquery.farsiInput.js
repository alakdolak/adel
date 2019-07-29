// <![CDATA[
(function ($) {
    $.fn.farsiInput = function (options) {
        let defaults = {
            changeLanguageKey: 145 /* Scroll lock */
        };

        var options = $.extend(defaults, options);

        let lang = 'fa';

        let keys = new Array(1711, 0, 0, 0, 0, 1608, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1705, 1572, 0, 1548,
                             1567, 0, 1616, 1571, 8250, 0, 1615, 0, 0, 1570, 1577, 0, 0, 0, 1569, 1573, 0, 0, 1614, 1612, 1613, 0, 0,
                             8249, 1611, 171, 0, 187, 1580, 1688, 1670, 0, 1600, 1662, 1588, 1584, 1586, 1740, 1579, 1576, 1604, 1575,
                             1607, 1578, 1606, 1605, 1574, 1583, 1582, 1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589, 1591, 1594, 1592);

        let substituteChar = function (charCode, e) {
            if (navigator.appName == "Microsoft Internet Explorer") {			                
				window.event.keyCode = charCode;
            }
            else {
                insertAtCaret(String.fromCharCode(charCode), e);
            }
        };

        let insertAtCaret = function (str, e) {
            let obj = e.target;
            let startPos = obj.selectionStart;
            let endPos = obj.selectionEnd;
            let scrollTop = obj.scrollTop;
            obj.value = obj.value.substring(0, startPos) + str + obj.value.substring(endPos, obj.value.length);
            obj.focus();
            obj.selectionStart = startPos + str.length;
            obj.selectionEnd = startPos + str.length;
            obj.scrollTop = scrollTop;
            e.preventDefault();
        };

        let keyDown = function (e) {
            let evt = e || window.event;
            let key = evt.keyCode ? evt.keyCode : evt.which;
            if (key == options.changeLanguageKey) {
                lang = (lang == 'en') ? 'fa' : 'en';
                return true;
            }
        };

        let fixYeKeHalfSpace = function (key, evt) {
            let originalKey = key;
            let arabicYeCharCode = 1610;
            let persianYeCharCode = 1740;
            let arabicKeCharCode = 1603;
            let persianKeCharCode = 1705;
            let halfSpace = 8204;

            switch (key) {
                case arabicYeCharCode:
                    key = persianYeCharCode;
                    break;
                case arabicKeCharCode:
                    key = persianKeCharCode;
                    break;
            }

            if (evt.shiftKey && key == 32) {
                key = halfSpace;
            }

            if (originalKey != key) {
                substituteChar(key, evt);
            }
        };

        let keyPress = function (e) {
            if (lang != 'fa')
                return;

            let evt = e || window.event;
            let key = evt.keyCode ? evt.keyCode : evt.which;
            fixYeKeHalfSpace(key, evt);
            let isNotArrowKey = (evt.charCode != 0) && (evt.which != 0);
            if (isNotArrowKey && (key > 38) && (key < 123)) {
                let pCode = (keys[key - 39]) ? (keys[key - 39]) : key;
                substituteChar(pCode, evt);
            }
        }

        return this.each(function () {
            let input = $(this);
            input.keypress(function (e) {
                keyPress(e);
            });
            input.keydown(function (e) {
                keyDown(e);
            });
            $(this).on('paste', function (e) {
                return false;
            });

        });
    };
})(jQuery);
// ]]>