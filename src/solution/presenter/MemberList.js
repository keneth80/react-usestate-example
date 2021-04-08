import { h, create } from 'virtual-dom';
import { CustomComponent } from './Common';


class MemberList extends CustomComponent {

    /**
    * @name 생성자 함수
    * @param {state} object
    * @description 생성자 함수로 최초 데이터를 받아서 virtual tree 구축과 함께 HTML node를 생성 및 저장한다.
    */
    constructor(state) {
        super();
        // data가 반영된 virtual dom의 정보를 저장한다.
        this.virtualDomTree = this.setVirtualTreeNode(state);
        // virtual dom을 html node로 생성.
        this.htmlNode = create(this.virtualDomTree);
    }

    /**
    * @name setVirtualTreeNode
    * @param {Array} list
	* @returns virtual node
    * @description data가 binding 된 virtual tree (html templete) 구축 및 action 함수 정의.
    */
    setVirtualTreeNode({ list }) {
        const [members, setMembers] = this.useState(list);
    
        const onKeyUp = (event) => {
            if (window.event.keyCode === 13) {
                members.push(event.target.value);
                event.target.value = '';
                setMembers(members);
            }
        };
    
        const addRow = () => {
            members.push(this.htmlNode.querySelector('#text-' + this.uuid).value);
            this.htmlNode.querySelector('#text-' + this.uuid).value = '';
            setMembers(members);
        }
    
        return h('div', { style: 'width: 100%; margin-top: 10px' }, [
            h('div', { style: 'width: 100%; position: relative;' }, [
                h('input', { id: 'text-' + this.uuid, type: 'text', onkeyup: (event) => onKeyUp(event) }, []),
                h('button', { style: 'margin-left: 10px;', onclick: () => addRow() }, ['Add']),
            ]),
            h('div', { id: 'list-container', style: 'height: 300px; overflow: auto;'}, [
                members.map((item, index) => h('span', { key: 'item' + index, style: 'display: block;' }, [item]))
            ])
        ]);
    }
}

export default MemberList;