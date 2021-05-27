import Vue from 'vue'
import { Button } from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input,} from 'element-ui'
import {Container,Header,Aside,Main} from "element-ui";
import {Menu,MenuItem,MenuItemGroup,Submenu,Col} from "element-ui";
import {Breadcrumb,BreadcrumbItem,Card,Row,Table,TableColumn,Switch,Tooltip} from "element-ui";
import {Pagination,Dialog,Tag,Tree,Select,Option,Cascader} from 'element-ui'
import {Message, MessageBox } from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Col)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)

// 下面已经引用，无需注册
// Vue.use(Message)
// Vue.use(MessageBox)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
