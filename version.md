20220321

1. 修改考題圖片顯示
2. server static folder set
3. csv file format fix

20220322
修改 csv 檔案格式
user table 新增最後練時間及成績

20220327
修改 submitAnswer bug , 原因出於 createScore import 一支非必要的 icon 導致第一次編譯時太慢

20220330
modules 優化
修改學照學員學號，依來源不同取得不同之學號設定
團報=> 10340A001
學照學號後方+S => 10340A001S

修改 libs/user getStudentNum function
增加一個 source_id 報名來源參數

const SQL = `SELECT max(user_stu_num) as user_stu_name, train_period_name FROM users right join train_book as tb on tb.train_book_id = users.train_book_id inner join train_period as tp on tp.train_period_id = tb.train_period_id where tb.train_period_id = '${trainPeriodId}' and source_id = '${sourceId}' <=== add group by train_period_name;`;

libs/front/user getStudentNumber

20220408

新增教師管理
修改一般使用者也可以登入管理頁面的 bug
新增設定頁面

20220509
新增設定頁面
車輛類別、課程類別、 上課時間管理

20220520
預約頁面完成

1110521
合約及報名表完成