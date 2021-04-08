import { diff, patch } from 'virtual-dom';

/**
* @name CustomComponent class
* @description 공통 기능을 갖는 component class
*/
export class CustomComponent {
    constructor() {
        // component의 unique한 아이디를 부여하기 위함. (같은 컴포넌트를 여러개 출력 시 디버깅하기 위함.)
        this.uuid = uuid();
        // data를 저장하는 state 변수
        this.state = null;
        // html node
        this.htmlNode = null;
        // virtual dom tree
        this.virtualDomTree = null;
        // etc
        this.current = {};
    }

    /**
    * @name updateState
    * @param {*} newState
    * @description state 변경에 따른 virtual dom update
    */
    updateState(newState) {
        // state를 업데이트한다.
        // 기존 데이터와 새로운 데이터를 병합하여 새로운 state를 저장한다.
        // 현재는 키가 list 하나이므로 newState의 데이터로 덮어질 것.
        this.state = Object.assign({}, this.state, newState);

        // 변경된 state 정보를 가지고 tree 를 갱신한다.
        const newVirtualDomTree = this.setVirtualTreeNode(this.state);
        // 변경된 정보를 체크한다.
        const changes = diff(this.virtualDomTree, newVirtualDomTree);

        // 기존 node에 변경된 tree 정보를 patch 한다.
        this.htmlNode = patch(this.htmlNode, changes);
        // 변경 된 tree 정보는 다시 새롭게 저장한다.
        this.virtualDomTree = newVirtualDomTree;
    };

    /**
    * @name useState
    * @param {*} data
	* @returns [현재값, 변경 함수]
    * @description react useState함수와 같은 역할
    */
    useState(value) {
        // 초기값 지정
		if (!this.state) {
			this.state = { value };
		}
        return [
            this.state.value,
            data => this.updateState({ data })
        ];
    }

    /**
    * @name setVirtualTreeNode
    * @param {object} state
	* @returns virtual node
    * @description data가 binding 된 virtual tree (html templete) 구축 및 action 함수 정의.
    */
    setVirtualTreeNode(state) {}
}

/**
* @name useState
* @param {*} value
* @description react useState함수와 같은 역할
*/
export const useState = function (value) {
    console.log('useState : ', this);
    return [
		value,
		data => this.updateState({ data })
	];
}

export const uuid = () => {
    return 'xxyyxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
        return v.toString(16);
    });
}
