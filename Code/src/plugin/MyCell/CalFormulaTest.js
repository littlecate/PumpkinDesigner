'use strict';
function calFormulaTest() {

    var Assert = {};
    Assert.IsTrue = function (m, v) {
        if (!v) {
            console.log(m + " is not OK!");
        }
    }

    function DoJobTest1() {
        var code = "if(find(\"abc\",\"a\")>=0,\"aaa\",\"bbb\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest1", s == "aaa");
    }
    DoJobTest1();


    function DoJobTest1_1() {
        var code = "IF(\"/\"=\"/\",\"/\",\"bbb\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest1_1", s == "/");
    }
    DoJobTest1_1();


    function DoJobTest2() {
        var code = "value(\"abc\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest2", s == "0");
    }
    DoJobTest2();


    function DoJobTest2_1() {
        var code = "value(\"1\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest2_1", s == "1");
    }
    DoJobTest2_1();


    function DoJobTest3() {
        var code = "(\"abc\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest3", s == "abc");
    }
    DoJobTest3();


    function DoJobTest4() {
        var code = "(\"abc\"+\"_\"+\"cd\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest4", s == "abc_cd");
    }
    DoJobTest4();


    function DoJobTest5() {
        var code = "\"abc\"+\"_\"+\"cd\"";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest5", s == "abc_cd");
    }
    DoJobTest5();

    function DoJobTest6() {
        var code = "1+2+3+4+5";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest6", s == "15");
    }
    DoJobTest6();


    function DoJobTest7() {
        var code = "1+2-3+4+5";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest7", s == "9");
    }
    DoJobTest7();


    function DoJobTest8() {
        var code = "value(1)+2-3+4+5";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest8", s == "9");
    }
    DoJobTest8();


    function DoJobTest9() {
        var code = "value(1)+2-3+4+5-6";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest9", s == "3");
    }
    DoJobTest9();


    function DoJobTest10() {
        var code = "value(1)+2-value(3)+4+5";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest10", s == "9");
    }
    DoJobTest10();

    function DoJobTest11() {
        var code = "value(1)+2-value(3)+5*5";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest11", s == "25");
    }
    DoJobTest11();


    function DoJobTest12() {
        var code = "value(1)+2-value(3)+5*5*2";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest12", s == "50");
    }
    DoJobTest12();


    function DoJobTest13() {
        var code = "value(1)+2-value(3)+5*5*2*(1+1)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest13", s == "100");
    }
    DoJobTest13();


    function DoJobTest14() {
        var code = "(1+1)*(2+2)*3";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest14", s == "24");
    }
    DoJobTest14();


    function DoJobTest15() {
        var code = "(1+1)*(2+2)*3*(1+1)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest15", s == "48");
    }
    DoJobTest15();


    function DoJobTest16() {
        var code = "True and True";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest16", s == "true");
    }
    DoJobTest16();


    function DoJobTest17() {
        var code = "True and True and False";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest17", s == "false");
    }
    DoJobTest17();


    function DoJobTest18() {
        var code = "True and True and False";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest18", s == "false");
    }
    DoJobTest18();


    function DoJobTest19() {
        var code = "(1+1)>2 and (2+2)>4";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest19", s == "false");
    }
    DoJobTest19();


    function DoJobTest20() {
        var code = "(1+1)>1 and (2+2)>2";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest20", s == "true");
    }
    DoJobTest20();


    function DoJobTest21() {
        var code = "datevalue(\"2022年4月27日\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        var date = new Date(Convert.ToInt64(s));        
        Assert.IsTrue("DoJobTest21", s == date.getTime().toString());
    }
    DoJobTest21();


    function DoJobTest22() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),0)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest22", s == "2022-4-27");
    }
    DoJobTest22();


    function DoJobTest23() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),1)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest23", s == "2022-04-27 00:00:00");
    }
    DoJobTest23();


    function DoJobTest24() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),8)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest24", s == "二○二二年四月二十七日");
    }
    DoJobTest24();


    function DoJobTest25() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),9)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest25", s == "二○二二年四月");
    }
    DoJobTest25();


    function DoJobTest26() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),10)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest26", s == "四月二十七日");
    }
    DoJobTest26();


    function DoJobTest27() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),11)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest27", s == "2022年4月27日");
    }
    DoJobTest27();


    function DoJobTest28() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),12)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest28", s == "2022年4月");
    }
    DoJobTest28();


    function DoJobTest29() {
        var code = "dateStr(datevalue(\"2022年4月27日\"),13)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest29", s == "4月27日");
    }
    DoJobTest29();


    function DoJobTest30() {
        var code = "dateStr(date(2022,4,27),13)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest30", s == "4月27日");
    }
    DoJobTest30();


    function DoJobTest31() {
        var code = "left(\"abc\",2)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest31", s == "ab");
    }
    DoJobTest31();


    function DoJobTest32() {
        var code = "left(\"abc\",4)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest32", s == "abc");
    }
    DoJobTest32();


    function DoJobTest34() {
        var code = "lower(\"ABc\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest34", s == "abc");
    }
    DoJobTest34();


    function DoJobTest35() {
        var code = "mid(\"ABc\",0,2)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest35", s == "AB");
    }
    DoJobTest35();


    function DoJobTest35_1() {
        var code = "mid(\"ABc\",1,2)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest35_1", s == "Bc");
    }
    DoJobTest35_1();


    function DoJobTest36() {
        var code = "mid(\"ABc\",0,4)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest36", s == "ABc");
    }
    DoJobTest36();


    function DoJobTest36_1() {
        var code = "mid(\"ABc\",2,4)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest36_1", s == "c");
    }
    DoJobTest36_1();


    function DoJobTest37() {
        var code = "now()";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        var date = new Date(Convert.ToInt64(s));
        Assert.IsTrue("DoJobTest37", s == date.getTime().toString());
    }
    DoJobTest37();


    function DoJobTest38() {
        var code = "right(\"ABc\",2)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest38", s == "Bc");
    }
    DoJobTest38();


    function DoJobTest39() {
        var code = "right(\"ABc\",4)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest39", s == "ABc");
    }
    DoJobTest39();


    function DoJobTest40() {
        var code = "round(25.16,1)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest40", s == "25.2");
    }
    DoJobTest40();


    function DoJobTest41() {
        var code = "round(25.16,0)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest41", s == "25");
    }
    DoJobTest41();


    function DoJobTest42() {
        var code = "sin(25.16)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest42", s == Math.Sin(25.16).toString());
    }
    DoJobTest42();


    function DoJobTest43() {
        var code = "sqrt(25.16)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest43", s == Math.Sqrt(25.16).toString());
    }
    DoJobTest43();


    function DoJobTest44() {
        var code = "string(25.16)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest44", s == (25.16).toString());
    }
    DoJobTest44();


    function DoJobTest45() {
        var code = "strlen(\"abcd\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest45", s == "4");
    }
    DoJobTest45();


    function DoJobTest46() {
        var code = "tan(25.16)";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest46", s == Math.Tan(25.16).toString());
    }
    DoJobTest46();


    function DoJobTest47() {
        var code = "today()";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        var date = new Date(Convert.ToInt64(s));
        Assert.IsTrue("DoJobTest47", s == date.getTime().toString());
    }
    DoJobTest47();


    function DoJobTest48() {
        var code = "trimleft(\"   abc \")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest48", s == "abc ");
    }
    DoJobTest48();


    function DoJobTest49() {
        var code = "trimright(\"   abc \")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest49", s == "   abc");
    }
    DoJobTest49();


    function DoJobTest50() {
        var code = "upper(\"AbC\")";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest50", s == "ABC");
    }
    DoJobTest50();


    function DoJobTest51() {
        var code = "-1+1+1+2+3+4+5";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });
        var s = new CalFormula(formula).DoJob();
        Assert.IsTrue("DoJobTest51", s == "15");
    }
    DoJobTest51();


    function DoJobTest52() {
        var code = "if(\"/\"=\"符合\",\"合格\",if(\"/\"=\"不符合\",\"不合格\",\"/\"))";
        var formula = new Formula({
            codeLine: Comman.SplitSource(code),
            targetCol: 1,
            targetRow: 2
        });        
        var s = new CalFormula(formula).DoJob();        
        Assert.IsTrue("DoJobTest52", s == "/");
    }
    DoJobTest52();
}