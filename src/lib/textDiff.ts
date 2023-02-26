var MATCH: number = 0;
var INS: number = 1;
var DEL: number = 2;

export function diffButty(o: string, n: string) {
  return processResult(processLines(o, n));
}

// NESTED FUNCTIONS FOLLOW
function processLines(o: string, n: string) {
  /*: Array.<Object.<String, int>>*/
  var result /*: Array.<Object.<String, int>>*/ = [];
  var diff /*: Array.<Object.<String, int>>*/ = [];
  var item /*: Object.<String, int>*/;

  var a: Array<string>;
  var b: Array<string>;
  var c /*: Array.<Array.<int>>*/;

  var suba: string = "";
  var subb: string = "";
  var subd /*: Array.<Object.<String, int>>*/ = [];

  a = splitByLine(o);
  b = splitByLine(n);

  c = calculateLCS(a, b);

  diff = readoutDiff(c, a, b, a.length - 1, b.length - 1);

  for (var i: number = 0; i < diff.length; i++) {
    item = diff[i];

    if (item.type == MATCH) {
      if (suba && !subb) {
        result.push({ str: suba, type: DEL });
      } else if (!suba && subb) {
        result.push({ str: subb, type: INS });
      } else if (suba && subb) {
        subd = processWords(suba, subb);
        //result = result.concat(subd);
        Array.prototype.push.apply(result, subd);
      }

      suba = "";
      subb = "";

      result.push(item);
      continue;
    } else if (item.type == INS) {
      subb += item.str;
    } else if (item.type == DEL) {
      suba += item.str;
    }
  }

  if (suba && !subb) {
    result.push({ str: suba, type: DEL });
  } else if (!suba && subb) {
    result.push({ str: subb, type: INS });
  } else if (suba && subb) {
    subd = processWords(suba, subb);
    //result = result.concat(subd);
    Array.prototype.push.apply(result, subd);
  }

  return result;
}
function processWords(o: string, n: string) {
  /*: Array.<Object.<String, int>>*/
  var result /*: Array.<Object.<String, int>>*/ = [];
  var diff /*: Array.<Object.<String, int>>*/ = [];
  var item /*: Object.<String, int>*/;

  var a: Array<string>;
  var b: Array<string>;
  var c /*: Array.<Array.<int>>*/;

  var lcs: number = 0;

  var suba: string = "";
  var subb: string = "";
  var subd /*: Array.<Object.<String, int>>*/ = [];

  a = splitByWord(o);
  b = splitByWord(n);

  c = calculateLCS(a, b);

  lcs = c[a.length - 1][b.length - 1];

  if (lcs < 2) {
    return [
      { str: n, type: INS },
      { str: o, type: DEL },
    ];
  }

  diff = readoutDiff(c, a, b, a.length - 1, b.length - 1);

  for (var i: number = 0; i < diff.length; i++) {
    item = diff[i];

    if (item.type == MATCH) {
      if (suba && !subb) {
        result.push({ str: suba, type: DEL });
      } else if (!suba && subb) {
        result.push({ str: subb, type: INS });
      } else if (suba && subb) {
        subd = processChars(suba, subb);
        //result = result.concat(subd);
        Array.prototype.push.apply(result, subd);
      }

      suba = "";
      subb = "";

      result.push(item);
      continue;
    } else if (item.type == INS) {
      subb += item.str;
    } else if (item.type == DEL) {
      suba += item.str;
    }
  }

  if (suba && !subb) {
    result.push({ str: suba, type: DEL });
  } else if (!suba && subb) {
    result.push({ str: subb, type: INS });
  } else if (suba && subb) {
    subd = processChars(suba, subb);
    //result = result.concat(subd);
    Array.prototype.push.apply(result, subd);
  }

  return result;
}
function processChars(o: string, n: string) {
  /*: Array.<Object.<String, int>>*/
  var a: Array<string>;
  var b: Array<string>;
  var c /*: Array.<Array.<int>>*/;

  var lcs: number = 0;

  if (!o) {
    return [{ str: n, type: INS }];
  }

  if (!n) {
    return [{ str: o, type: DEL }];
  }

  a = o.split("");
  b = n.split("");

  c = calculateLCS(a, b);

  lcs = c[a.length - 1][b.length - 1];

  if (lcs < 3) {
    return [
      { str: n, type: INS },
      { str: o, type: DEL },
    ];
  } else {
    return readoutDiff(c, a, b, a.length - 1, b.length - 1);
  }
}

function processResult(diff: any) {
  var item;
  var html: Array<string> = [];

  for (var i: number = 0; i < diff.length; i++) {
    item = diff[i];

    switch (item.type) {
      default:
      case MATCH:
        match(item.str);
        break;

      case INS:
        ins(item.str);
        break;

      case DEL:
        del(item.str);
        break;
    }
  }

  return html.join("");

  function match(s: string) {
    /*: void*/
    if (!s) {
      return;
    }
    s = escapeHTML(s);
    html.push(s);
  }

  function ins(s: string) {
    /*: void*/
    if (!s) {
      return;
    }
    s =
      "<span style='background-color:lightblue; color:blue;'>" +
      escapeHTML(s) +
      "</span>";
    html.push(s);
  }

  function del(s: string) {
    /*: void*/
    if (!s) {
      return "";
    }
    s =
      "<span style='background-color:pink;color:red;'>" +
      escapeHTML(s) +
      "</span>";
    html.push(s);
  }

  function escapeHTML(s: string) {
    return s
      .replace(/\&/gi, "&amp;")
      .replace(/</gi, "&lt;")
      .replace(/>/gi, "&gt;");
  }
}
function calculateLCS(a: Array<string>, b: Array<string>) {
  var c: any = [];

  a.unshift(" ");
  b.unshift(" ");

  for (var i: number = 0; i < a.length; i++) {
    c[i] = [];
    c[i][0] = 0;
  }

  for (var j: number = 0; j < b.length; j++) {
    c[0][j] = 0;
  }

  for (var i: number = 1; i < a.length; i++) {
    for (var j: number = 1; j < b.length; j++) {
      if (a[i] == b[j]) {
        c[i][j] = c[i - 1][j - 1] + 1;
      } else {
        c[i][j] = Math.max(c[i][j - 1], c[i - 1][j]);
      }
    }
  }

  return c;
}

function splitByLine(s: string) {
  var lines: any;
  var re /*: RegExp*/ = /([^\r\n]+$|[^\r\n]*(\r\n|\r|\n))/g;
  lines = s.match(re);
  if (!lines) {
    lines = [];
  }
  return lines;
}

function splitByWord(s: string) {
  var words: any;
  var re /*: RegExp*/ = /([ \t\r\n]+|[^ \t\r\n\w]+|\w+)/g;
  words = s.match(re);
  if (!words) {
    words = [];
  }
  return words;
}

function readoutDiff(
  c: any,
  a: Array<string>,
  b: Array<string>,
  i: number,
  j: number
) {
  var diff: any = [];

  function recurse(i: number, j: number) {
    if (i > 0 && j > 0 && a[i] == b[j]) {
      recurse(i - 1, j - 1);
      diff.push({ str: a[i], type: MATCH });
    } else {
      if (j > 0 && (i == 0 || c[i][j - 1] >= c[i - 1][j])) {
        recurse(i, j - 1);
        diff.push({ str: b[j], type: INS });
      } else if (i > 0 && (j == 0 || c[i][j - 1] < c[i - 1][j])) {
        recurse(i - 1, j);
        diff.push({ str: a[i], type: DEL });
      }
    }
  }

  recurse(i, j);

  return diff;
}
