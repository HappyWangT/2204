// 创建类
class Problem {
    //注意： 构造方法，实例化类的时候自动调用
    constructor() {
        //! this指向的是实例化对象
        // console.log(this);

        // 调用数据获取的方法
        this.getData();
        // 获取保存按钮，绑定点击事件
        this.$('.save-data').addEventListener('click', this.saveData)


        // 给tbody绑定点击事件，利用事件委托，将所有子元素的点击事件，都委托给tbody
        // bind 返回一个新的函数引用，改变其内部this指向
        // bind(this)  这个this指向实例化对象 Probiem
        this.$('.table tbody').addEventListener('click', this.distribute.bind(this));


        // 给模态框中的确认删除按钮绑定事件
        this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));

        // 给模态框中的修改按钮的保存绑定点击事件
        this.$('.modify-data').addEventListener('click', this.saveModify.bind(this));


    }

    //********获取节点的方法*******//
    $(ele) {
        // 获取节点对象
        let res = document.querySelectorAll(ele);
        // 判断当前页面只有一个符合条件的，返回单个节点对象，否则返回节点集合
        return res.length == 1 ? res[0] : res;
    }

    //**********tbody的点击回调函数*******//
    distribute(eve) {
        // console.log(111);
        // console.log(eve);
        // this 指向当前节点对象
        // console.log(this);

        // 获取事件源
        let tar = eve.target;
        // console.log(tar);
        // 判断按钮上是否有指定的类名，确定当前点击事件是什么按钮，contains是否包含，是true，否false
        // 删除  btn-del
        // 修改  ben-modify
        // console.log(tar.classList.contains('btn-del'));

        // 判断点击的是否为删除按钮，如果是的话，调用删除的方法
        if (tar.classList.contains('btn-del')) {
            // this 指向当前节点对象，tbody
            // console.log(this);

            // 传递参数tar，将获取的事件源传递给调用的函数
            this.delData(tar);
        }


        // 判断点击的是否为修改按钮，如果是的话，调用修改的方法
        if (tar.classList.contains('btn-modify')) {
            this.modifyData(tar);
        }
    }

    //************修改模态框的回调函数*************/ 
    modifyData(target) {
        // console.log(target);

        // 1、弹出修改模态框
        $('#modifyModal').modal('show');

        // 2、将原有的数据显示在模态框中
        // 获取要修改的数据，判断是span还是button，找到对应的tr
        let trObj = '';
        if (target.nodeName == 'SPAN') {
            trObj = target.parentNode.parentNode.parentNode;
            // console.log(trObj);
        }
        if (target.nodeName == 'BUTTON') {
            trObj = target.parentNode.parentNode;
            // console.log(trObj);
        }
        // 获取所有的子节点，分别取出name，age，sex
        let chil = trObj.children;
        // console.log(chil);
        let id = chil[0].innerHTML;
        let name = chil[1].innerHTML;
        let sex = chil[2].innerHTML;
        let age = chil[3].innerHTML;
        // console.log(id, name, sex, age);
        //  将获取到的内容放到修改的模态框中
        let form = this.$('#modifyModal form').elements;
        // console.log(form);
        form.name.value = name;
        form.sex.value = sex;
        form.age.value = age;
        // 将id设置为属性
        this.modifyId = id;
    }

    //************修改模态框中的保存按钮*************// 
    saveModify() {
        // console.log(this.modifyId);
        // 收集表单中的数据

        // 获取表单中每个的值
        // let form = this.$('#modifyModal form').elements;
        // console.log(form);
        // let name=form.name.value.trim();
        // let sex=form.sex.value.trim();
        // let age=form.age.value.trim();


        // 获取表单中的数据，不为空则发送给后台
        // 解构赋值
        let { name, sex, age } = this.$('#modifyModal form').elements;
        // console.log(name, sex, age);
        let nameVal = name.value.trim();
        let sexVal = sex.value.trim();
        let ageVal = age.value.trim();
        // console.log(nameVal, sexVal, ageVal);

        // 进行非空验证
        if (!nameVal || !sexVal || !ageVal) {
            throw new Error('不能为空哦！');
            // return;
        }
        axios.put('http://localhost:3000/problem/' + this.modifyId, {
            name: nameVal,
            sex: sexVal,
            age: ageVal
        }).then(res => {
            // console.log(res);
            // 状态码为200，请求成功，刷新页面
            if (res.status == 200) {
                location.reload();
            }
        })
    }

    //**************删除数据的方法****************//
    delData(target) {
        // 形参接收传递来的target

        // this 指向实例化对象
        // console.log(this);

        // console.log(target);
        // 将当前准备要删除的节点，保存到属性上
        this.target = target;

        // console.log('这是删除的');

        // 弹出确认删除的模态框，通过js控制
        // 显示模态框
        // $ 方法 是jQuery中的方法
        $('#delModal').modal('show')
    }

    //***********删除的模态框中的确认按钮*************//   
    confirmDel() {
        // console.log(this);
        // 获取当前节点对象
        // console.log(this.target);
        // 获取当前节点对象的名称
        // console.log(this.target.nodeName);

        //获取tr第一个子元素 id
        let id = 0;
        // 判断点击的是button还是span
        if (this.target.nodeName == 'SPAN') {
            let trObj = this.target.parentNode.parentNode.parentNode;
            // console.log(trObj);
            id = trObj.firstElementChild.innerHTML;
            // console.log(id);
        }
        if (this.target.nodeName == 'BUTTON') {
            let trObj = this.target.parentNode.parentNode;
            // console.log(trObj);
            id = trObj.firstElementChild.innerHTML;
            // console.log(id);
        }

        // 将id 发送给json-server服务器，删除对应的数据，刷新页面
        axios.delete('http://localhost:3000/problem/' + id).then(res => {
            // console.log(res);

            // 判断状态为200，删除成功，刷新页面
            if (res.status == 200) {
                location.reload();
            }
        })
    }

    //*********保存事件的方法 *******//
    saveData() {
        // 这个this指向保存，给保存按钮绑定事件，this指向当前节点对象
        // console.log(this);

        // 1、获取添加表单
        let form = document.forms[0].elements;
        // console.log(form);
        let name = form.name.value.trim();
        let sex = form.sex.value.trim();
        let age = form.age.value.trim();
        // console.log(name, sex, age);
        ///2、判断表单选项是否为空，或为空格

        if (!name || !sex || !age) {
            // console.log(111);
            throw new Error('不能为空哦！')
        }
        // 3、将数据通过ajax，发送给json-server服务器，进行保存
        axios.post('http://localhost:3000/problem', {
            name,
            age,
            sex
        }).then(res => {
            // console.log(res);
            // 如果添加成功，刷新页面
            if (res.status == 201) {
                location.reload();
            }
        })
    }

    //********获取数据的方法*******//
    getData() {
        // console.log('这是获取数据');

        // 获取tbody，页面中只有一个，返回单个节点对象
        // let tbody = this.$('tbody')
        // console.log(tbody);

        // 获取div，页面中有多个div，返回节点集合
        // let div = this.$('div');
        // console.log(div);

        /****发送axios请求，获取数据****/
        axios.get('http://localhost:3000/problem').then(res => {
            // console.log(res);
            // 1、需要的数据和状态
            let { data, status } = res;
            // console.log(data);
            // console.log(status);
            // 2、当状态为200时，表示请求成功
            if (status == 200) {
                // console.log(data);
                // 3、将获取的数据，渲染到页面中
                let html = '';
                data.forEach(ele => {
                    // console.log(ele);
                    // 方法1   直接给删除按钮绑定click事件，this指向当前节点对象，但是回调方法必须是静态方法，静态方法的this指向实例化对象
                    //  <button type="button" class="btn btn-danger btn-xs" onclick="this.delData">
                    // static delData(){}


                    // 方法2    使用事件委托，将修改和删除的点击事件，委托给父元素tbody

                    html += `<tr>
                    <th scope="row">${ele.id}</th>
                    <td>${ele.name}</td>
                    <td>${ele.sex}</td>
                    <td>${ele.age}</td>
                    <td>
                    <button type="button" class="btn btn-danger btn-xs btn-del">
                    <span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-success btn-xs btn-modify">
                    <span class="glyphicon glyphicon-pencil btn-modify" aria-hidden="true"></span>
                    </button>
                    </td>
                </tr>`;

                });
                // console.log(html);
                // 4、将拼接的html追加到页面当中
                this.$('.table tbody').innerHTML = html
            }
        })
    }
}
new Problem;