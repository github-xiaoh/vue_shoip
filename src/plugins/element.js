import Vue from 'vue'
import { Button } from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input,Message} from 'element-ui'
import {Container,Header,Aside,Main} from "element-ui";
import {Menu,MenuItem,MenuItemGroup,Submenu,Col} from "element-ui";
import {Breadcrumb,BreadcrumbItem,Card,Row,Table,TableColumn,Switch,Tooltip} from "element-ui";
import {Pagination,Dialog} from 'element-ui'
import { MessageBox } from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Message)
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
Vue.use(MessageBox)



Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
