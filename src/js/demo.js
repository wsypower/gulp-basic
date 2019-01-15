/**
 * 定义常量或变量
 * @var {object}
 * @desc
 * @property {string} a a 属性 a
 * @property {string} b b 属性 b
 */

var foo = {
  a: 'a',
  b: 'b'
};

/**
 * 定义公共函数
 * @method
 * @param {Type}  data  目标对象
 * @returns {Type} 匹配对象
 * @desc   根据目标对象获取匹配对象
 */

function matchedNumber(data) {
  return '返回对象'
}

/**
 * 定义DOM操作或事件绑定
 * @method
 * @param {Type}  obj  目标对象
 * @param {Type}  type  绑定事件类型
 * @param {Type}  type  事件执行回调函数
 * @desc   绑定事件
 */

function addEvent(obj, type, handle) {

    
  try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本

        
    obj.addEventListener(type, handle, false);

      
  } catch (e) {

        
    try { // IE8.0及其以下版本

          
      obj.attachEvent('on' + type, handle);

          
    } catch (e) { // 早期浏览器

            
      obj['on' + type] = handle;

          
    }

      
  }

}

/**
* @method
* @param {Type} data 请求参数
* 例:
* {
* target: 手机号
* }
* @desc
*/
function ajaxGetData(data) {

  $.ajax({
      type: "GET",
      url: "test.json",
      data: data,
      dataType: "json",
      success: function(data){
                  $('#resText').empty();   //清空resText里面的所有内容
                  var html = data.result;
                  $('#resText').html(html);
               }
  });
}

/**
* @method
* 定义初始化函数 并执行
* @desc
*/

function init() {
  ajaxGetData ();
}

init();

