/**
 * 两个数组的最小不同算法
 * 因为这里传进来的数组只有 sort 之后的数组，
 * 不存在数组的增减，所以舍去了一些不必要的判断
 * @link https://github.com/derbyjs/arraydiff
 * @author ydr.me
 * @created 2016-12-22 13:04
 */


'use strict';


module.exports = arrayDiff;

// Based on some rough benchmarking, this algorithm is about O(2n) worst case,
// and it can compute diffs on random arrays of length 1024 in about 34ms,
// though just a few changes on an array of length 1024 takes about 0.5ms

// arrayDiff.InsertDiff = InsertDiff;
// arrayDiff.RemoveDiff = RemoveDiff;
// arrayDiff.MoveDiff = MoveDiff;

function InsertDiff(index, values) {
    this.index = index;
    this.values = values;
    this.type = 'insert';
}

function RemoveDiff(index, howMany) {
    this.index = index;
    this.howMany = howMany;
    this.type = 'remove'
}

function MoveDiff(from, to, howMany) {
    this.from = from;
    this.to = to;
    this.howMany = howMany;
    this.type = 'move';
}

function strictEqual(a, b) {
    return a === b;
}

function arrayDiff(before, after, equalFn) {
    if (!equalFn) equalFn = strictEqual;

    // Find all items in both the before and after array, and represent them
    // as moves. Many of these "moves" may end up being discarded in the last
    // pass if they are from an index to the same index, but we don't know this
    // up front, since we haven't yet offset the indices.
    //
    // Also keep a map of all the indices accounted for in the before and after
    // arrays. These maps are used next to create insert and remove diffs.
    var beforeLength = before.length;
    var afterLength = after.length;
    var moves = [];
    var beforeMarked = {};
    var afterMarked = {};
    var howMany = 0;
    var move;
    var index;
    var afterIndex;

    for (var beforeIndex = 0; beforeIndex < beforeLength; beforeIndex++) {
        var beforeItem = before[beforeIndex];
        for (afterIndex = 0; afterIndex < afterLength; afterIndex++) {
            if (afterMarked[afterIndex]) continue;
            if (!equalFn(beforeItem, after[afterIndex])) continue;
            var from = beforeIndex;
            var to = afterIndex;
            howMany = 0;
            do {
                beforeMarked[beforeIndex++] = afterMarked[afterIndex++] = true;
                howMany++;
            } while (
            beforeIndex < beforeLength &&
            afterIndex < afterLength &&
            equalFn(before[beforeIndex], after[afterIndex]) && !afterMarked[afterIndex]
                );
            moves.push(new MoveDiff(from, to, howMany));
            beforeIndex--;
            break;
        }
    }

    // Create a remove for all of the items in the before array that were
    // not marked as being matched in the after array as well
    var removes = [];
    for (beforeIndex = 0; beforeIndex < beforeLength;) {
        if (beforeMarked[beforeIndex]) {
            beforeIndex++;
            continue;
        }
        index = beforeIndex;
        howMany = 0;
        while (beforeIndex < beforeLength && !beforeMarked[beforeIndex++]) {
            howMany++;
        }
        removes.push(new RemoveDiff(index, howMany));
    }

    // Create an insert for all of the items in the after array that were
    // not marked as being matched in the before array as well
    var inserts = [];
    for (afterIndex = 0; afterIndex < afterLength;) {
        if (afterMarked[afterIndex]) {
            afterIndex++;
            continue;
        }
        index = afterIndex;
        howMany = 0;
        while (afterIndex < afterLength && !afterMarked[afterIndex++]) {
            howMany++;
        }
        var values = after.slice(index, index + howMany);
        inserts.push(new InsertDiff(index, values));
    }

    var insertsLength = inserts.length;
    var removesLength = removes.length;
    var movesLength = moves.length;
    var i, j;

    // Offset subsequent removes and moves by removes
    var count = 0;
    for (i = 0; i < removesLength; i++) {
        var remove = removes[i];
        remove.index -= count;
        count += remove.howMany;
        for (j = 0; j < movesLength; j++) {
            move = moves[j];
            if (move.from >= remove.index) move.from -= remove.howMany;
        }
    }

    // Offset moves by inserts
    for (i = insertsLength; i--;) {
        var insert = inserts[i];
        howMany = insert.values.length;
        for (j = movesLength; j--;) {
            move = moves[j];
            if (move.to >= insert.index) move.to -= howMany;
        }
    }

    // Offset the to of moves by later moves
    for (i = movesLength; i-- > 1;) {
        move = moves[i];
        if (move.to === move.from) continue;
        for (j = i; j--;) {
            var earlier = moves[j];
            if (earlier.to >= move.to) earlier.to -= move.howMany;
            if (earlier.to >= move.from) earlier.to += move.howMany;
        }
    }

    // Only output moves that end up having an effect after offsetting
    var outputMoves = [];

    // Offset the from of moves by earlier moves
    for (i = 0; i < movesLength; i++) {
        move = moves[i];
        if (move.to === move.from) continue;
        outputMoves.push(move);
        for (j = i + 1; j < movesLength; j++) {
            var later = moves[j];
            if (later.from >= move.from) later.from -= move.howMany;
            if (later.from >= move.to) later.from += move.howMany;
        }
    }

    return removes.concat(outputMoves, inserts);
}

