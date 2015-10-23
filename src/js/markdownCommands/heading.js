/**
 * @fileoverview Implements Heading markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @exports Heading
 * @augments Command
 * @augments MarkdownCommand
 */
var Heading = CommandManager.command('markdown',/** @lends Heading */{
    name: 'Heading',
    keyMap: ['Ctrl-H', 'Ctrl-H'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var textToModify, range, from, to, textLinesToModify, lineLength, i, lengthOfCurrentLineBefore,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        // 선택된 영역을 가공함
        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        lengthOfCurrentLineBefore = doc.getLine(to.line).length;

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //원하는 대로 가공한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = getHeadingMarkdown(textLinesToModify[i]);
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;
        doc.setCursor(range.to);

        cm.focus();
    }
});

var FIND_HEADING_RX = /^#+\s/g;

function getHeadingMarkdown(text) {
    var foundedHeading = text.match(FIND_HEADING_RX),
        heading;

    if (foundedHeading) {
        heading = '#' + foundedHeading[0];

        if (heading.match(/#/g).length === 7) {
            heading = '# ';
        }

        text = text.split(foundedHeading[0])[1];
    } else {
        heading = '# ';
    }

    return heading + text;
}

module.exports = Heading;