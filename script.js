// 树节点类
class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
        this.x = 0;
        this.y = 0;
        this.element = null;
    }
}

// 二叉树节点类
class BinaryTreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.element = null;
    }
}

// 主应用类
class TreeVisualizer {
    constructor() {
        this.tree = null;
        this.isBinary = false;
        this.traversalType = null;
        this.traversalSteps = [];
        this.currentStepIndex = -1;
        this.isPlaying = false;
        this.playInterval = null;
        this.playSpeed = 1000;
        
        this.initElements();
        this.bindEvents();
    }
    
    initElements() {
        // 获取DOM元素
        this.treeContainer = document.getElementById('treeContainer');
        this.traversalSequence = document.getElementById('traversalSequence');
        this.currentStepInfo = document.getElementById('currentStep');
        
        // 按钮
        this.randomTreeBtn = document.getElementById('randomTree');
        this.randomBinaryTreeBtn = document.getElementById('randomBinaryTree');
        this.preOrderBtn = document.getElementById('preOrder');
        this.inOrderBtn = document.getElementById('inOrder');
        this.postOrderBtn = document.getElementById('postOrder');
        this.levelOrderBtn = document.getElementById('levelOrder');
        this.nextStepBtn = document.getElementById('nextStep');
        this.playPauseBtn = document.getElementById('playPause');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        
        // 遍历按钮数组
        this.traversalBtns = [
            this.preOrderBtn,
            this.inOrderBtn,
            this.postOrderBtn,
            this.levelOrderBtn
        ];
    }
    
    bindEvents() {
        // 树生成按钮
        this.randomTreeBtn.addEventListener('click', () => this.generateRandomTree());
        this.randomBinaryTreeBtn.addEventListener('click', () => this.generateRandomBinaryTree());
        
        // 遍历方式按钮
        this.preOrderBtn.addEventListener('click', (event) => this.selectTraversal('preOrder', event));
        this.inOrderBtn.addEventListener('click', (event) => this.selectTraversal('inOrder', event));
        this.postOrderBtn.addEventListener('click', (event) => this.selectTraversal('postOrder', event));
        this.levelOrderBtn.addEventListener('click', (event) => this.selectTraversal('levelOrder', event));
        
        // 控制按钮
        this.nextStepBtn.addEventListener('click', () => this.nextStep());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.resetBtn.addEventListener('click', () => this.resetTraversal());
        
        // 速度控制
        this.speedSlider.addEventListener('input', () => {
            this.playSpeed = 2000 / this.speedSlider.value;
            if (this.isPlaying) {
                this.stopPlayback();
                this.startPlayback();
            }
        });
    }
    
    // 生成随机普通树
    generateRandomTree() {
        this.resetAll();
        this.isBinary = false;
        
        // 随机生成节点数量 (3-10)
        const nodeCount = Math.floor(Math.random() * 8) + 3;
        
        // 使用更简单的方法生成树
        this.tree = this.buildRandomTree(nodeCount);
        
        // 验证树结构
        if (!this.validateTreeStructure(this.tree)) {
            console.error('生成的树结构有误，重新生成');
            this.generateRandomTree();
            return;
        }
        
        // 更严格的验证：检查每个节点只有一个父节点
        if (!this.validateSingleParent(this.tree)) {
            console.error('发现节点有多个父节点，重新生成');
            this.generateRandomTree();
            return;
        }
        
        console.log('生成的树结构:');
        this.printTreeStructure(this.tree);
        console.log('节点总数:', this.countNodes(this.tree));
        console.log('期望节点数:', nodeCount);
        console.log('父子关系:');
        this.printParentChildRelationships(this.tree);
        
        this.drawTree();
        this.enableTraversalButtons();
    }
    
    // 构建随机树的简单方法
    buildRandomTree(nodeCount) {
        if (nodeCount <= 0) return null;
        
        // 生成唯一的节点值
        const uniqueValues = this.getUniqueRandomValues(nodeCount);
        console.log('生成的节点值:', uniqueValues);
        
        // 创建所有节点
        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new TreeNode(uniqueValues[i]));
        }
        
        // 第一个节点作为根节点
        const root = nodes[0];
        console.log('根节点:', root.value);
        
        // 使用完全不同的方法：递归构建
        this.buildTreeRecursively(root, nodes, 1);
        
        // 验证树结构
        const allNodes = this.getAllNodes(root);
        console.log('实际节点数:', allNodes.length);
        console.log('期望节点数:', nodeCount);
        
        // 验证每个节点只有一个父节点
        const parentMap = new Map();
        const validateResult = this.validateSingleParent(root, parentMap);
        
        if (!validateResult || allNodes.length !== nodeCount) {
            console.error('树结构验证失败，重新生成');
            return this.buildRandomTree(nodeCount);
        }
        
        return root;
    }
    
    // 递归构建树
    buildTreeRecursively(parent, allNodes, startIndex) {
        if (startIndex >= allNodes.length) return;
        
        // 为当前父节点分配子节点
        const remainingNodes = allNodes.length - startIndex;
        const maxChildren = Math.min(3, remainingNodes);
        const childCount = Math.floor(Math.random() * maxChildren) + 1;
        
        console.log(`${parent.value} 分配 ${childCount} 个子节点`);
        
        for (let i = 0; i < childCount && startIndex < allNodes.length; i++) {
            const childNode = allNodes[startIndex++];
            parent.children.push(childNode);
            console.log(`  ${parent.value} -> ${childNode.value}`);
            
            // 递归为子节点分配子节点
            this.buildTreeRecursively(childNode, allNodes, startIndex);
        }
    }
    
    // 递归生成随机树结构
    generateRandomTreeStructure(node, remainingNodes, currentDepth, maxDepth) {
        if (remainingNodes <= 0 || currentDepth > maxDepth) return;
        
        // 随机决定子节点数量 (1-3)
        const childCount = Math.min(
            remainingNodes,
            Math.floor(Math.random() * 3) + 1
        );
        
        // 创建子节点
        for (let i = 0; i < childCount; i++) {
            const childNode = new TreeNode(this.getRandomValue());
            node.children.push(childNode);
        }
        
        // 为每个子节点分配剩余节点
        let nodesLeft = remainingNodes - childCount;
        for (let i = 0; i < childCount && nodesLeft > 0; i++) {
            // 为当前子节点分配一些节点
            const nodesForThisChild = Math.min(
                nodesLeft,
                Math.floor(Math.random() * nodesLeft) + 1
            );
            
            this.generateRandomTreeStructure(
                node.children[i],
                nodesForThisChild,
                currentDepth + 1,
                maxDepth
            );
            
            nodesLeft -= nodesForThisChild;
        }
    }
    
    // 生成随机二叉树
    generateRandomBinaryTree() {
        this.resetAll();
        this.isBinary = true;
        
        // 创建根节点
        const root = new BinaryTreeNode(this.getRandomValue());
        
        // 随机生成节点数量 (3-10)
        const nodeCount = Math.floor(Math.random() * 8) + 3;
        
        // 生成二叉树结构
        this.generateRandomBinaryTreeStructure(root, nodeCount - 1, 1, 4);
        
        this.tree = root;
        
        // 验证树结构
        if (!this.validateTreeStructure(this.tree)) {
            console.error('生成的二叉树结构有误，重新生成');
            this.generateRandomBinaryTree();
            return;
        }
        
        // 更严格的验证：检查每个节点只有一个父节点
        if (!this.validateSingleParent(this.tree)) {
            console.error('发现节点有多个父节点，重新生成');
            this.generateRandomBinaryTree();
            return;
        }
        
        this.drawTree();
        this.enableTraversalButtons();
    }
    
    // 递归生成随机二叉树结构
    generateRandomBinaryTreeStructure(node, remainingNodes, currentDepth, maxDepth) {
        if (remainingNodes <= 0 || currentDepth > maxDepth) return;
        
        // 随机分配剩余节点到左右子树
        const leftNodes = Math.floor(Math.random() * remainingNodes);
        const rightNodes = remainingNodes - leftNodes;
        
        // 创建左子节点
        if (leftNodes > 0) {
            node.left = new BinaryTreeNode(this.getRandomValue());
            this.generateRandomBinaryTreeStructure(
                node.left,
                leftNodes - 1,
                currentDepth + 1,
                maxDepth
            );
        }
        
        // 创建右子节点
        if (rightNodes > 0) {
            node.right = new BinaryTreeNode(this.getRandomValue());
            this.generateRandomBinaryTreeStructure(
                node.right,
                rightNodes - 1,
                currentDepth + 1,
                maxDepth
            );
        }
    }
    
    // 生成随机字母值
    getRandomValue() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // 生成唯一的随机字母值
    getUniqueRandomValues(count) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const shuffled = letters.split('').sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // 验证树结构是否正确（每个节点只有一个父节点）
    validateTreeStructure(node, visited = new Set()) {
        if (!node) return true;
        
        // 检查当前节点是否已被访问过
        if (visited.has(node)) {
            console.error('发现重复节点:', node.value, '节点对象:', node);
            return false;
        }
        
        visited.add(node);
        
        // 检查子节点
        if (this.isBinary) {
            return this.validateTreeStructure(node.left, visited) && 
                   this.validateTreeStructure(node.right, visited);
        } else {
            for (const child of node.children) {
                if (!this.validateTreeStructure(child, visited)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 更严格的验证：检查每个节点是否只有一个父节点
    validateSingleParent(node, parentMap = new Map()) {
        if (!node) return true;
        
        // 检查子节点
        if (this.isBinary) {
            if (node.left) {
                if (parentMap.has(node.left)) {
                    console.error('节点', node.left.value, '有多个父节点');
                    return false;
                }
                parentMap.set(node.left, node);
                if (!this.validateSingleParent(node.left, parentMap)) return false;
            }
            if (node.right) {
                if (parentMap.has(node.right)) {
                    console.error('节点', node.right.value, '有多个父节点');
                    return false;
                }
                parentMap.set(node.right, node);
                if (!this.validateSingleParent(node.right, parentMap)) return false;
            }
        } else {
            for (const child of node.children) {
                if (parentMap.has(child)) {
                    console.error('节点', child.value, '有多个父节点');
                    return false;
                }
                parentMap.set(child, node);
                if (!this.validateSingleParent(child, parentMap)) return false;
            }
        }
        
        return true;
    }
    
    // 统计树中的节点数量
    countNodes(node) {
        if (!node) return 0;
        
        if (this.isBinary) {
            return 1 + this.countNodes(node.left) + this.countNodes(node.right);
        } else {
            let count = 1;
            for (const child of node.children) {
                count += this.countNodes(child);
            }
            return count;
        }
    }
    
    // 获取树中的所有节点
    getAllNodes(node, nodes = []) {
        if (!node) return nodes;
        nodes.push(node);
        if (this.isBinary) {
            this.getAllNodes(node.left, nodes);
            this.getAllNodes(node.right, nodes);
        } else {
            for (const child of node.children) {
                this.getAllNodes(child, nodes);
            }
        }
        return nodes;
    }
    
    // 打印树结构用于调试
    printTreeStructure(node, level = 0) {
        if (!node) return;
        
        const indent = '  '.repeat(level);
        console.log(`${indent}${node.value}`);
        
        if (this.isBinary) {
            this.printTreeStructure(node.left, level + 1);
            this.printTreeStructure(node.right, level + 1);
        } else {
            for (const child of node.children) {
                this.printTreeStructure(child, level + 1);
            }
        }
    }
    
    // 打印详细的父子关系
    printParentChildRelationships(node, parent = null) {
        if (!node) return;
        
        if (parent) {
            console.log(`${parent.value} -> ${node.value}`);
        } else {
            console.log(`Root: ${node.value}`);
        }
        
        if (this.isBinary) {
            if (node.left) this.printParentChildRelationships(node.left, node);
            if (node.right) this.printParentChildRelationships(node.right, node);
        } else {
            for (const child of node.children) {
                this.printParentChildRelationships(child, node);
            }
        }
    }
    
    // 绘制树
    drawTree() {
        this.treeContainer.innerHTML = '';
        
        if (!this.tree) return;
        
        // 计算容器中心
        const containerWidth = this.treeContainer.clientWidth;
        const containerHeight = this.treeContainer.clientHeight;
        const centerX = containerWidth / 2;
        const centerY = 50; // 根节点距离顶部的距离
        
        if (this.isBinary) {
            this.calculateBinaryTreeLayout(this.tree, centerX, centerY);
            this.drawBinaryTree(this.tree);
        } else {
            this.calculateTreeLayout(this.tree, centerX, centerY);
            this.drawGeneralTree(this.tree);
        }
    }
    
    // 计算普通树布局
    calculateTreeLayout(node, x = 0, y = 0, level = 0) {
        node.x = x;
        node.y = y;
        
        if (node.children.length === 0) return;
        
        const childSpacing = 120; // 增加子节点间距
        const totalWidth = (node.children.length - 1) * childSpacing;
        const startX = x - totalWidth / 2;
        
        node.children.forEach((child, index) => {
            const childX = startX + index * childSpacing;
            const childY = y + 100; // 增加层级间距
            this.calculateTreeLayout(child, childX, childY, level + 1);
        });
    }
    
    // 计算二叉树布局
    calculateBinaryTreeLayout(node, x = 0, y = 0, level = 0) {
        node.x = x;
        node.y = y;
        
        if (node.left) {
            this.calculateBinaryTreeLayout(node.left, x - 100, y + 100, level + 1);
        }
        if (node.right) {
            this.calculateBinaryTreeLayout(node.right, x + 100, y + 100, level + 1);
        }
    }
    
    // 绘制普通树
    drawGeneralTree(node) {
        // 绘制连接线
        node.children.forEach(child => {
            this.drawEdge(node, child);
            this.drawGeneralTree(child);
        });
        
        // 绘制节点
        this.drawNode(node);
    }
    
    // 绘制二叉树
    drawBinaryTree(node) {
        // 绘制连接线
        if (node.left) {
            this.drawEdge(node, node.left);
            this.drawBinaryTree(node.left);
        }
        if (node.right) {
            this.drawEdge(node, node.right);
            this.drawBinaryTree(node.right);
        }
        
        // 绘制节点
        this.drawNode(node);
    }
    
    // 绘制节点
    drawNode(node) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.textContent = node.value;
        nodeElement.style.left = (node.x - 20) + 'px'; // 减去节点半径以居中
        nodeElement.style.top = (node.y - 20) + 'px';  // 减去节点半径以居中
        
        this.treeContainer.appendChild(nodeElement);
        node.element = nodeElement;
    }
    
    // 绘制连接线
    drawEdge(parent, child) {
        const parentX = parent.x; // 节点中心
        const parentY = parent.y;
        const childX = child.x;
        const childY = child.y;
        
        const dx = childX - parentX;
        const dy = childY - parentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        const edge = document.createElement('div');
        edge.className = 'edge';
        edge.style.width = distance + 'px';
        edge.style.left = parentX + 'px';
        edge.style.top = parentY + 'px';
        edge.style.transform = `rotate(${angle}deg)`;
        
        this.treeContainer.appendChild(edge);
    }
    
    // 选择遍历方式
    selectTraversal(type, event) {
        this.traversalType = type;
        
        // 更新按钮状态
        this.traversalBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // 生成遍历步骤
        this.generateTraversalSteps();
        
        // 启用控制按钮
        this.nextStepBtn.disabled = false;
        this.playPauseBtn.disabled = false;
        this.resetBtn.disabled = false;
    }
    
    // 生成遍历步骤
    generateTraversalSteps() {
        this.traversalSteps = [];
        
        if (this.isBinary) {
            this.generateBinaryTreeTraversalSteps();
        } else {
            this.generateGeneralTreeTraversalSteps();
        }
        
        this.currentStepIndex = -1;
        this.updateTraversalDisplay();
    }
    
    // 生成二叉树遍历步骤
    generateBinaryTreeTraversalSteps() {
        const steps = [];
        
        switch (this.traversalType) {
            case 'preOrder':
                this.preOrderTraversal(this.tree, steps);
                break;
            case 'inOrder':
                this.inOrderTraversal(this.tree, steps);
                break;
            case 'postOrder':
                this.postOrderTraversal(this.tree, steps);
                break;
            case 'levelOrder':
                this.levelOrderTraversal(this.tree, steps);
                break;
        }
        
        this.traversalSteps = steps;
    }
    
    // 生成普通树遍历步骤
    generateGeneralTreeTraversalSteps() {
        const steps = [];
        
        switch (this.traversalType) {
            case 'preOrder':
                this.preOrderTraversal(this.tree, steps);
                break;
            case 'postOrder':
                this.postOrderTraversal(this.tree, steps);
                break;
            case 'levelOrder':
                this.levelOrderTraversal(this.tree, steps);
                break;
            default:
                // 普通树没有中序遍历，使用先序遍历代替
                this.preOrderTraversal(this.tree, steps);
                break;
        }
        
        this.traversalSteps = steps;
    }
    
    // 先序遍历
    preOrderTraversal(node, steps) {
        if (!node) return;
        
        steps.push({
            node: node,
            action: 'visit',
            description: `访问节点 ${node.value}`
        });
        
        if (this.isBinary) {
            if (node.left) this.preOrderTraversal(node.left, steps);
            if (node.right) this.preOrderTraversal(node.right, steps);
        } else {
            node.children.forEach(child => {
                this.preOrderTraversal(child, steps);
            });
        }
    }
    
    // 中序遍历（仅二叉树）
    inOrderTraversal(node, steps) {
        if (!node) return;
        
        if (node.left) this.inOrderTraversal(node.left, steps);
        
        steps.push({
            node: node,
            action: 'visit',
            description: `访问节点 ${node.value}`
        });
        
        if (node.right) this.inOrderTraversal(node.right, steps);
    }
    
    // 后序遍历
    postOrderTraversal(node, steps) {
        if (!node) return;
        
        if (this.isBinary) {
            if (node.left) this.postOrderTraversal(node.left, steps);
            if (node.right) this.postOrderTraversal(node.right, steps);
        } else {
            node.children.forEach(child => {
                this.postOrderTraversal(child, steps);
            });
        }
        
        steps.push({
            node: node,
            action: 'visit',
            description: `访问节点 ${node.value}`
        });
    }
    
    // 层序遍历
    levelOrderTraversal(node, steps) {
        if (!node) return;
        
        const queue = [node];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            steps.push({
                node: current,
                action: 'visit',
                description: `访问节点 ${current.value}`
            });
            
            if (this.isBinary) {
                if (current.left) queue.push(current.left);
                if (current.right) queue.push(current.right);
            } else {
                current.children.forEach(child => {
                    queue.push(child);
                });
            }
        }
    }
    
    // 下一步
    nextStep() {
        if (this.currentStepIndex < this.traversalSteps.length - 1) {
            this.currentStepIndex++;
            this.highlightCurrentStep();
        }
    }
    
    // 高亮当前步骤
    highlightCurrentStep() {
        // 清除所有高亮
        this.clearHighlights();
        
        // 高亮当前节点
        const currentStep = this.traversalSteps[this.currentStepIndex];
        if (currentStep && currentStep.node.element) {
            currentStep.node.element.classList.add('highlighted');
        }
        
        // 更新显示
        this.updateTraversalDisplay();
        this.updateCurrentStepInfo();
    }
    
    // 清除所有高亮
    clearHighlights() {
        const nodes = this.treeContainer.querySelectorAll('.node');
        nodes.forEach(node => {
            node.classList.remove('highlighted', 'visited');
        });
    }
    
    // 更新遍历显示
    updateTraversalDisplay() {
        this.traversalSequence.innerHTML = '';
        
        this.traversalSteps.forEach((step, index) => {
            const stepElement = document.createElement('span');
            stepElement.textContent = step.node.value;
            stepElement.style.padding = '5px 10px';
            stepElement.style.margin = '2px';
            stepElement.style.borderRadius = '3px';
            stepElement.style.backgroundColor = '#e0e0e0';
            
            if (index <= this.currentStepIndex) {
                stepElement.style.backgroundColor = '#2196F3';
                stepElement.style.color = 'white';
            }
            
            this.traversalSequence.appendChild(stepElement);
        });
    }
    
    // 更新当前步骤信息
    updateCurrentStepInfo() {
        if (this.currentStepIndex >= 0 && this.currentStepIndex < this.traversalSteps.length) {
            const step = this.traversalSteps[this.currentStepIndex];
            this.currentStepInfo.textContent = `步骤 ${this.currentStepIndex + 1}/${this.traversalSteps.length}: ${step.description}`;
        } else {
            this.currentStepInfo.textContent = '';
        }
    }
    
    // 切换播放/暂停
    togglePlayPause() {
        if (this.isPlaying) {
            this.stopPlayback();
        } else {
            this.startPlayback();
        }
    }
    
    // 开始播放
    startPlayback() {
        this.isPlaying = true;
        this.playPauseBtn.textContent = '暂停';
        
        this.playInterval = setInterval(() => {
            if (this.currentStepIndex < this.traversalSteps.length - 1) {
                this.nextStep();
            } else {
                this.stopPlayback();
            }
        }, this.playSpeed);
    }
    
    // 停止播放
    stopPlayback() {
        this.isPlaying = false;
        this.playPauseBtn.textContent = '自动播放';
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }
    
    // 重置遍历
    resetTraversal() {
        this.currentStepIndex = -1;
        this.clearHighlights();
        this.updateTraversalDisplay();
        this.updateCurrentStepInfo();
        this.stopPlayback();
    }
    
    // 重置所有
    resetAll() {
        this.tree = null;
        this.traversalType = null;
        this.traversalSteps = [];
        this.currentStepIndex = -1;
        this.stopPlayback();
        
        // 清除显示
        this.treeContainer.innerHTML = '';
        this.traversalSequence.innerHTML = '';
        this.currentStepInfo.textContent = '';
        
        // 禁用按钮
        this.nextStepBtn.disabled = true;
        this.playPauseBtn.disabled = true;
        this.resetBtn.disabled = true;
        
        // 清除遍历按钮状态
        this.traversalBtns.forEach(btn => btn.classList.remove('active'));
    }
    
    // 启用遍历按钮
    enableTraversalButtons() {
        this.traversalBtns.forEach(btn => {
            btn.disabled = false;
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TreeVisualizer();
});