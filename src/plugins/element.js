import Vue from 'vue'
import { Button } from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input,} from 'element-ui'
import {Container,Header,Aside,Main} from "element-ui";
import {Menu,MenuItem,MenuItemGroup,Submenu,Col} from "element-ui";
import {Breadcrumb,BreadcrumbItem,Card,Row,Table,TableColumn,Switch,Tooltip} from "element-ui";
import {Pagination,Dialog,Tag,Tree,Select,Option,Image,DatePicker,TimePicker} from 'element-ui'
import {CheckboxGroup,RadioGroup,Radio,Checkbox,Link,Loading,Tabs,TabPane} from 'element-ui'
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
Vue.use(Image)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(CheckboxGroup)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Link)
Vue.use(Loading)
Vue.use(Tabs)
Vue.use(TabPane)



// Vue.use(Message)
// Vue.use(MessageBox)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
