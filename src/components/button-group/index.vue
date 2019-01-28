<template>
	<div class="operate">
		<span class='operate-btn' >
			<Button type="success" 
				icon="refresh" 
				shape="circle" 
				class='add' 
				@click='refreshHandler'>刷新</Button>
		</span>
		<span class='operate-btn' v-if='addStatus'>
			<Button type="primary" 
				icon="plus-round" 
				shape="circle" 
				@click='addHandler'>新增</Button>
		</span>
		
		<span class='operate-btn' v-if='shipmentStatus'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='shipmentHandler'>
				出货
			</Button>
		</span>
		<span class='operate-btn' v-show='edit'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='editHandler'>编辑</Button>
		</span>
		<!-- <span class='operate-btn' v-show='returBtn'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='returBtnHandler'>返回</Button>
		</span> -->
        <span class='operate-btn' v-show='deployStatus'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='deployHandler'>配置订单</Button>
		</span>
		<span class='operate-btn' v-show='ignoredStatus'>
			<Button type="primary" icon="chatboxes" shape="circle" 
				@click='ignoredHandler'>已忽略</Button>
		</span>
		<span class='operate-btn' v-show='permissions'>
			<Button type="warning" icon="permissions" shape="circle" 
				@click='permissionsHandler'>授权</Button>
		</span>
		<span class='operate-btn' v-show='supplyStatus'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='supplyHandler'>补充订单</Button>
		</span>
		
		<span class='operate-btn' v-show='dynamicBtn.status'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='dynamicBtnHandler'>{{dynamicBtn.text}}</Button>
		</span>
		<span class='operate-btn' v-show='operate.status'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='handleOperateClick'>
				{{operate.text}}
			</Button>
		</span>
		<span class='operate-btn' v-show='backLibraryStatus'>
			<Button type="warning" icon="edit" shape="circle" @click='handleBackLibrary'>回库</Button>
		</span>
		<span class='operate-btn' v-show='deleteStatus'>
			<Button type="error" icon="trash-a" shape="circle"  
				@click='deleteHandler(data)'>删除</Button>
		</span>
        <span class='operate-btn' v-show='finishStatus'>
			<Button type="warning" icon="edit" shape="circle" 
				@click='tofinishOrder'>完成</Button>
		</span>
		<span class='operate-btn' v-show='confirmStatus'>
			<Button type="primary" 
				icon="plus-round" 
				shape="circle" 
				class='confirm' 
				@click='handleConfirmClick'>
				确认出货
			</Button>
		</span>
		<Dropdown trigger="click" @on-click='handmoreclick' v-show='moreOperations.length'>
			<Button type="primary" shape="circle">
            	更多操作
            	<Icon type="arrow-down-b"></Icon>
        	</Button>
			<DropdownMenu slot="list">
				<DropdownItem 
					:name='item.name' 
					v-for='(item, index) in moreOperations' 
					:key="index">
					{{item.name}}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
		
		<!--弹出层确认删除等等-->
		<Modal v-model="deletteModelStatus" width="310" :styles="{top: '250px'}">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>提示</span>
	        </p>
	        <div>
				<h3>确认删除吗?</h3>
			</div>
	        <div slot="footer">
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="handleCancel">
	            	取消
	            </Button>
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="confirmDeleteHandler">
	            	确定
	            </Button>
	        </div>
		</Modal>
		<Modal v-model="operatModelStatus" width="310" :styles="{top: '250px'}">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>提示</span>
	        </p>
	        <div>
				<h3>{{operate.dec}}</h3>
			</div>
	        <div slot="footer">
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="handleCancel">
	            	取消
	            </Button>
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="sureOperate">
	            	确定
	            </Button>
	        </div>
		</Modal>
		<Modal v-model="sureModelStatus" width="310" :styles="{top: '250px'}">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>提示</span>
	        </p>
	        <div>
				<h3>确认出货吗?一旦确认将不能修改</h3>
			</div>
	        <div slot="footer">
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="handleCancel">
	            	取消
	            </Button>
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="sureShipment">
	            	确定
	            </Button>
	        </div>
		</Modal>
		
	</div>

</template>

<script>
	export default {
		props: {
			//删除按钮
			deleteStatus: {
				type: Boolean,
				default: false

			},
			//刷新按钮
			refreshStatus: {
				type: Boolean,
				default: false
			},
			//出货按钮
			shipmentStatus: {
				type: Boolean,
				default: false

            },
			//操作按钮 这个按钮是针对动态弹出model 动态显示提示语
			operate: {
				type: Object,
				default: function(){
					return {
						status: false,
						text: '操作',
						dec: '确认操作吗?'
					}
				}

			},
			
			//添加按钮
			addStatus: {
				type: Boolean,
				default: true

			},
			//返回按钮
			// returBtn: {
			// 	type: Boolean,
			// 	default: true
            // },
            //配置订单
            deployStatus:{
                type:Boolean,
                default:false
			},
			 //已忽略
            ignoredStatus:{
                type:Boolean,
                default:false
			},
			//确认按钮
			confirmStatus: {
				type: Boolean,
				default: false
			},
			//编辑按钮
			edit: {
				type: Boolean,
				default: false
			},
			//授权按钮
			permissions: {
				type: Boolean,
				default: false
			},
			data: {
				type: Object,
				required: false
			},
			//更多操作传入的数据
			moreOperations: {
				type: Array,
				default: function() {
					return [];
				}
			},
			//回库按钮
			backLibraryStatus: {
				type: Boolean,
				default: false
			},
			//补充订单状态
			supplyStatus: {
				type: Boolean,
				default: false
			},
			dynamicBtn: {
				default: function(){
					return {
						status: false,
						text: '确认订单'
					}
				}
			},
            finishStatus:{
                type: Boolean,
				default: false
            }
		},

		data() {
			return {
				showDown: false,
				deletteModelStatus: false,
				deleteItem:{},
				sureModelStatus: false,
				operatModelStatus: false
			}
		},
		methods: {
			
			clickMore() {
				this.showDown = !this.showDown;
			},
			//点击动态按钮事件
			handleOperateClick(){
				this.operatModelStatus =  true;
			},
			//取消确然删除,确认弹出层
			handleCancel(){
				this.deletteModelStatus = false;
				this.sureModelStatus = false;
				this.operatModelStatus =  false;
			},
			//			刷新事件
			refreshHandler(){
				this.$emit('refreshHandler');
			},
			//出货触发的事件
			shipmentHandler(){
				this.$emit('shipmentHandler');
			},
			//确认删除
			confirmDeleteHandler(){
				this.deletteModelStatus = false;
				this.$emit('deleteHandler', this.deleteItem);
			},
			//返回
			// returBtnHandler(){
			// 	this.$emit('returnBtnHandler');
			// },
			//确认操作向负组件通知事件
			sureOperate(){
				this.operatModelStatus = false;
				this.$emit('operate', );
			},
			//处理点击生成工单按钮事件
			workOrderHandler() {
				this.$emit('workOrderHandler');
			},
			//处理点击确定工单按钮事件
			sureOrderHandler() {
				this.$emit('sureOrderHandler');
			},
			//处理点击已忽略按钮事件
			ignoredHandler() {
				this.$emit('ignoredHandler');
			},
			//确认出货
			sureShipment(){
				this.sureModelStatus = false;
				this.$emit('handleConfirmClick');
			},
			//处理点击删除按钮事件
			deleteHandler(data) {
				this.deletteModelStatus = true;
				this.deleteItem = data;
			},
			//处理点击添加按钮事件
			addHandler() {
				this.$emit('addHandler');
			},
			//处理编辑点击事件
			editHandler() {
				this.$emit('editHandler');
            },
            deployHandler(){
                this.$emit('deployHandler')
            },
			permissionsHandler() {
				this.$emit('permissionsHandler');
			},
			handleBodyClick() {
				this.showDown = false;
			},
			//点击更多操作返回的回掉函数
			handmoreclick(name) {
				this.$emit('handmoreclick', name);
			},
			//处理回库的毁掉事件
			handleBackLibrary(){
				this.$emit('handleBackLibrary');
			},
			//处理确认的回掉事件
			handleConfirmClick(){
				this.sureModelStatus = true;
			},
			// 处理补充订单
			supplyHandler() {
				this.$emit('supplyHandler');
			},
			// 动态按钮
			dynamicBtnHandler(){
				this.$emit('dynamicBtnHandler');
			},
            tofinishOrder(){
                this.$emit('finishOrder')
            }
		},
		mounted() {
			this.$nextTick(() => {
				document.querySelector('body').addEventListener('click', (event) => {
					if(
						event.target.className.indexOf('hide_wrap') < 0 &&
						event.target.parentElement.className.indexOf('hide_wrap') < 0 &&
						event.target.parentElement.parentElement.className.indexOf('hide_wrap') < 0
					) {
						this.handleBodyClick();
					}
				});
			})
		},
		beforeDestroy() {
			document.querySelector('body').removeEventListener('click', this.handleBodyClick);
		}
	}
</script>

<style scoped>
	.add {
		margin-left: 10px;
	}
	
	.operate-btn {
		display: inline-block;
		vertical-align: middle;
		height: 32px;
		min-width: 75px;
		position: relative;
	}
	
	.more {
		position: absolute;
		top: 37px;
		left: 0;
		z-index: 888;
	}
	
	.more li {
		margin: 5px 0;
		padding-left: 0;
		margin-left: -10px;
	}
</style>