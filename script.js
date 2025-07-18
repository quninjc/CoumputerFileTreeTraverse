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
    
    // 生成随机二叉树 - 参考 algorithm-visualizer.org
    generateRandomBinaryTree() {
        this.resetAll();
        
        // 随机选择树的类型
        const treeTypes = ['balanced', 'random', 'skewed'];
        const selectedType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        
        // 根据选择的类型生成树
        switch (selectedType) {
            case 'balanced':
                this.tree = this.generateBalancedBinaryTree();
                break;
            case 'random':
                this.tree = this.generateRandomizedBinaryTree();
                break;
            case 'skewed':
                this.tree = this.generateSkewedBinaryTree();
                break;
            default:
                this.tree = this.generateBalancedBinaryTree();
        }
        
        this.drawTree();
        this.enableTraversalButtons();
    }
    
    // 生成平衡二叉树
    generateBalancedBinaryTree() {
        const maxDepth = 3; // 最大深度
        const maxNodes = 15; // 最大节点数
        
        // 创建节点
        const nodes = [];
        const nodeCount = Math.min(Math.pow(2, maxDepth) - 1, maxNodes);
        
        // 生成唯一的节点值
        const values = this.getUniqueNodeValues(nodeCount);
        
        // 创建所有节点
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new BinaryTreeNode(values[i]));
        }
        
        // 建立父子关系 (使用完全二叉树的索引关系)
        for (let i = 0; i < nodeCount; i++) {
            const leftChildIndex = 2 * i + 1;
            const rightChildIndex = 2 * i + 2;
            
            if (leftChildIndex < nodeCount) {
                nodes[i].left = nodes[leftChildIndex];
            }
            
            if (rightChildIndex < nodeCount) {
                nodes[i].right = nodes[rightChildIndex];
            }
        }
        
        return nodes[0]; // 返回根节点
    }
    
    // 生成随机二叉树
    generateRandomizedBinaryTree() {
        // 随机节点数量 (3-10)
        const nodeCount = Math.floor(Math.random() * 8) + 3;
        
        // 生成唯一的节点值
        const values = this.getUniqueNodeValues(nodeCount);
        
        // 创建根节点
        const root = new BinaryTreeNode(values[0]);
        
        // 随机插入其余节点
        for (let i = 1; i < nodeCount; i++) {
            this.insertNodeRandomly(root, new BinaryTreeNode(values[i]));
        }
        
        return root;
    }
    
    // 随机插入节点
    insertNodeRandomly(root, newNode) {
        const queue = [root];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // 随机决定是否在当前节点插入
            if (!current.left || !current.right) {
                // 如果左子节点或右子节点为空，随机选择一个位置插入
                if (!current.left && !current.right) {
                    // 两个位置都空，随机选择
                    if (Math.random() < 0.5) {
                        current.left = newNode;
                    } else {
                        current.right = newNode;
                    }
                } else if (!current.left) {
                    // 只有左子节点为空
                    current.left = newNode;
                } else {
                    // 只有右子节点为空
                    current.right = newNode;
                }
                return;
            }
            
            // 如果当前节点的子节点都已满，则将子节点加入队列
            queue.push(current.left);
            queue.push(current.right);
        }
    }
    
    // 生成偏斜二叉树
    generateSkewedBinaryTree() {
        // 随机节点数量 (3-8)
        const nodeCount = Math.floor(Math.random() * 6) + 3;
        
        // 生成唯一的节点值
        const values = this.getUniqueNodeValues(nodeCount);
        
        // 创建根节点
        const root = new BinaryTreeNode(values[0]);
        
        // 随机决定是左偏还是右偏
        const isLeftSkewed = Math.random() < 0.5;
        
        let current = root;
        for (let i = 1; i < nodeCount; i++) {
            const newNode = new BinaryTreeNode(values[i]);
            
            if (isLeftSkewed) {
                current.left = newNode;
            } else {
                current.right = newNode;
            }
            
            current = newNode;
        }
        
        return root;
    }
    
    // 生成唯一的节点值
    getUniqueNodeValues(count) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const values = [];
        
        // 确保不超过可用字母数
        count = Math.min(count, letters.length);
        
        // 生成唯一字母
        for (let i = 0; i < count; i++) {
            values.push(letters[i]);
        }
        
        return values;
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
        
        this.calculateBinaryTreeLayout(this.tree, centerX, centerY);
        this.drawBinaryTree(this.tree);
    }
    
    // 计算二叉树布局
    calculateBinaryTreeLayout(node, x = 0, y = 0, level = 0) {
        if (!node) return;
        
        // 设置节点位置
        node.x = x;
        node.y = y;
        
        // 计算树的深度
        const depth = this.getTreeDepth(this.tree);
        
        // 根据树的深度和当前层级调整水平间距
        // 较浅的层级使用较大的间距，较深的层级使用较小的间距
        const baseSpacing = 120; // 基础间距
        const horizontalSpacing = baseSpacing / Math.pow(1.5, level); // 随层级指数减小
        
        // 为左右子树分配位置
        if (node.left) {
            this.calculateBinaryTreeLayout(node.left, x - horizontalSpacing, y + 60, level + 1);
        }
        if (node.right) {
            this.calculateBinaryTreeLayout(node.right, x + horizontalSpacing, y + 60, level + 1);
        }
    }
    
    // 获取树的深度
    getTreeDepth(node) {
        if (!node) return 0;
        const leftDepth = this.getTreeDepth(node.left);
        const rightDepth = this.getTreeDepth(node.right);
        return Math.max(leftDepth, rightDepth) + 1;
    }
    
    // 统计树中的节点数量
    countNodes(node) {
        if (!node) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
    
    // 绘制二叉树
    drawBinaryTree(node) {
        if (!node) return;
        
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
        
        switch (this.traversalType) {
            case 'preOrder':
                this.preOrderTraversal(this.tree, this.traversalSteps);
                break;
            case 'inOrder':
                this.inOrderTraversal(this.tree, this.traversalSteps);
                break;
            case 'postOrder':
                this.postOrderTraversal(this.tree, this.traversalSteps);
                break;
            case 'levelOrder':
                this.levelOrderTraversal(this.tree, this.traversalSteps);
                break;
        }
        
        this.currentStepIndex = -1;
        this.updateTraversalDisplay();
    }
    
    // 先序遍历
    preOrderTraversal(node, steps) {
        if (!node) return;
        
        steps.push({
            node: node,
            action: 'visit',
            description: `访问节点 ${node.value}`
        });
        
        if (node.left) this.preOrderTraversal(node.left, steps);
        if (node.right) this.preOrderTraversal(node.right, steps);
    }
    
    // 中序遍历
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
        
        if (node.left) this.postOrderTraversal(node.left, steps);
        if (node.right) this.postOrderTraversal(node.right, steps);
        
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
            
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
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