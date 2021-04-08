import { h, create, diff, patch } from 'virtual-dom';

/**
* @name 생성자 함수
* @param {Array} list
* @description 생성자 함수로 최초 데이터를 받아서 virtual tree 구축과 함께 HTML node를 생성 및 저장한다.
*/
function Members({ list }) {
	// data를 저장하는 state 변수
	let state = null;
	// virtual dom tree
	let virtualDomTree = null;
	// html node
	let htmlNode = null;
	/**
	* @name updateState
	* @param {*} newState
	* @description state 변경에 따른 virtual dom update
	*/
	const updateState = function (newState) {
		// state를 업데이트한다.
		state = Object.assign({}, state, newState);

		// 변경된 state 정보를 가지고 tree 를 갱신한다.
		const newVirtualDomTree = setVirtualTreeNode(state);
		// 변경된 정보를 체크한다.
		const changes = diff(virtualDomTree, newVirtualDomTree);

		// 기존 node에 변경된 tree 정보를 patch 한다.
		htmlNode = patch(htmlNode, changes);
		// 변경 된 tree 정보는 다시 새롭게 저장한다.
		virtualDomTree = newVirtualDomTree;
	};

	/**
	* @name useState
	* @param {*} value
	* @returns [현재값, 변경 함수]
	* @description react useState함수와 같은 역할
	*/
	const useState = function (value) {
		// 초기값 지정
		if (!state) {
			state = { value };
		}

		// 두번째 값인 함수로 state를 변경해야만 값이 바뀌도록 한다.
		return [
			state.value,
			list => updateState({ list })
		];
	}

	/**
	* @name setVirtualTreeNode
	* @param {Array} list
	* @returns virtual node
	* @description list를 인자로 받아 data가 binding 된 virtual tree 구축 및 action 함수 정의.
	*/
	const setVirtualTreeNode = function ({ list }) {
		const [members, setMembers] = useState(list);

		const onKeyUp = (event) => {
			if (window.event.keyCode === 13) {
				members.push(event.target.value);
				event.target.value = '';
				setMembers(members);
			}
		};

		const addRow = () => {
			members.push(htmlNode.querySelector('#memberInput').value);
			htmlNode.querySelector('#memberInput').value = '';
			setMembers(members);
		}

		return h('div', { style: 'width: 100%; margin-top: 10px' }, [
			h('div', { style: 'width: 100%; position: relative;' }, [
				h('input', { id: 'memberInput', type: 'text', onkeyup: (event) => onKeyUp(event) }, []),
				h('button', { style: 'margin-left: 10px;', onclick: () => addRow() }, ['Add']),
			]),
			h('div', { id: 'list-container', style: 'height: 300px; overflow: auto;'}, [
				members && members.length ?
				members.map((item, index) => h('span', { key: 'item' + index, style: 'display: block;' }, [item])) :
				[]
			])
		]);
	}

	// virtual tree node를 갱신
	virtualDomTree = setVirtualTreeNode({ list });
	//virtual tree node를 html node로 생성
	htmlNode = create(virtualDomTree);
	return htmlNode;
};

export default Members;