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
        this.traversalSteps = [];
        this.currentStepIndex = -1;
        this.isPlaying = false;
        this.playInterval = null;
        this.playSpeed = 1000;
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.treeContainer = document.getElementById('treeContainer');
        this.traversalSequence = document.getElementById('traversalSequence');
        this.currentStepInfo = document.getElementById('currentStep');
        this.preOrderBtn = document.getElementById('preOrder');
        this.nextStepBtn = document.getElementById('nextStep');
        this.playPauseBtn = document.getElementById('playPause');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        this.traversalBtns = [this.preOrderBtn];
    }

    bindEvents() {
        this.preOrderBtn.addEventListener('click', () => {
            this.preOrderBtn.classList.add('active');
            this.generateTraversalSteps();
            this.nextStepBtn.disabled = false;
            this.playPauseBtn.disabled = false;
            this.resetBtn.disabled = false;
        });
        this.nextStepBtn.addEventListener('click', () => this.nextStep());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.resetBtn.addEventListener('click', () => this.resetTraversal());
        this.speedSlider.addEventListener('input', () => {
            this.playSpeed = 2000 / this.speedSlider.value;
            if (this.isPlaying) {
                this.stopPlayback();
                this.startPlayback();
            }
        });
    }

    generateTraversalSteps() {
        this.traversalSteps = [];
        this.preOrderTraversal(this.tree, this.traversalSteps);
        this.currentStepIndex = -1;
        this.updateTraversalDisplay();
        this.highlightCurrentStep();
    }

    preOrderTraversal(node, steps) {
        if (!node) return;
        steps.push({ node: node, action: 'visit', description: `复制 ${node.value}` });
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => this.preOrderTraversal(child, steps));
        }
    }

    nextStep() {
        if (this.currentStepIndex < this.traversalSteps.length - 1) {
            this.currentStepIndex++;
            this.highlightCurrentStep();
        }
    }

    highlightCurrentStep() {
        this.clearHighlights();
        for (let i = 0; i <= this.currentStepIndex; i++) {
            const step = this.traversalSteps[i];
            if (step && step.node.element) {
                if (i === this.currentStepIndex) {
                    step.node.element.classList.add('highlighted');
                } else {
                    step.node.element.classList.add('visited');
                }
            }
        }
        this.updateTraversalDisplay();
        this.updateCurrentStepInfo();
    }

    clearHighlights() {
        const nodes = this.treeContainer.querySelectorAll('.node');
        nodes.forEach(node => {
            node.classList.remove('highlighted', 'visited');
        });
    }

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
                stepElement.style.backgroundColor = '#4CAF50';
                stepElement.style.color = 'white';
            }
            this.traversalSequence.appendChild(stepElement);
        });
    }

    updateCurrentStepInfo() {
        if (this.currentStepIndex >= 0 && this.currentStepIndex < this.traversalSteps.length) {
            const step = this.traversalSteps[this.currentStepIndex];
            this.currentStepInfo.textContent = `步骤 ${this.currentStepIndex + 1}/${this.traversalSteps.length}: ${step.description}`;
        } else {
            this.currentStepInfo.textContent = '';
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.stopPlayback();
        } else {
            this.startPlayback();
        }
    }

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

    stopPlayback() {
        this.isPlaying = false;
        this.playPauseBtn.textContent = '自动播放';
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    resetTraversal() {
        this.currentStepIndex = -1;
        this.clearHighlights();
        this.updateTraversalDisplay();
        this.updateCurrentStepInfo();
        this.stopPlayback();
    }

    // 先递归计算每个节点的布局宽度
    calculateSubtreeWidth(node) {
        const nodeWidth = 60;
        const horizontalGap = 32;
        if (!node.children || node.children.length === 0) {
            node._subtreeWidth = nodeWidth;
            return nodeWidth;
        }
        let totalWidth = 0;
        node.children.forEach(child => {
            totalWidth += this.calculateSubtreeWidth(child);
        });
        totalWidth += (node.children.length - 1) * horizontalGap;
        node._subtreeWidth = Math.max(totalWidth, nodeWidth);
        return node._subtreeWidth;
    }

    // 再递归分配坐标，保证每个父节点的所有子节点整体居中排列
    assignTreeLayout(node, x, y) {
        const nodeWidth = 60;
        const horizontalGap = 32;
        const verticalSpacing = 70;
        node.x = x;
        node.y = y;
        if (!node.children || node.children.length === 0) return;
        // 计算所有子节点的总宽度
        let totalWidth = 0;
        node.children.forEach(child => {
            totalWidth += child._subtreeWidth;
        });
        totalWidth += (node.children.length - 1) * horizontalGap;
        // 让所有子节点整体居中排列
        let startX = x - totalWidth / 2;
        node.children.forEach(child => {
            const childCenter = startX + child._subtreeWidth / 2;
            const childY = y + verticalSpacing;
            this.assignTreeLayout(child, childCenter, childY);
            startX += child._subtreeWidth + horizontalGap;
        });
    }

    drawTree() {
        this.treeContainer.innerHTML = '';
        if (!this.tree) return;
        const containerWidth = this.treeContainer.clientWidth;
        const centerX = containerWidth / 2;
        const centerY = 50;
        this.calculateSubtreeWidth(this.tree);
        this.assignTreeLayout(this.tree, centerX, centerY);
        this.drawGeneralTree(this.tree);
    }

    drawGeneralTree(node) {
        if (!node) return;
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                this.drawEdge(node, child);
                this.drawGeneralTree(child);
            });
        }
        this.drawNode(node);
    }

    drawNode(node) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node file-node ' + (node.type || 'folder');
        nodeElement.innerHTML = this.getNodeIcon(node) + '<span class="file-label">' + node.value + '</span>';
        nodeElement.style.left = (node.x - 40) + 'px';
        nodeElement.style.top = (node.y - 20) + 'px';
        this.treeContainer.appendChild(nodeElement);
        node.element = nodeElement;
    }

    getNodeIcon(node) {
        switch (node.type) {
            case 'folder': return '📁 ';
            case 'system': return '⚙️ ';
            case 'exe': return '📝 ';
            case 'doc': return '📄 ';
            case 'other': return '🎮 ';
            default: return '📄 ';
        }
    }

    drawEdge(parent, child) {
        const parentX = parent.x;
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
}

// 文件系统目录树结构（根据SVG）
const fileSystemTree = {
    value: 'C盘',
    type: 'folder',
    children: [
        {
            value: 'Program Files',
            type: 'folder',
            children: [
                {
                    value: 'MS Office',
                    type: 'folder',
                    children: [
                        { value: 'Word.exe', type: 'exe' },
                        { value: 'Excel.exe', type: 'exe' }
                    ]
                },
                {
                    value: 'Chrome',
                    type: 'folder',
                    children: [
                        { value: 'chrome.exe', type: 'exe' }
                    ]
                }
            ]
        },
        {
            value: 'Users',
            type: 'folder',
            children: [
                {
                    value: '张同学',
                    type: 'folder',
                    children: [
                        {
                            value: 'Documents',
                            type: 'folder',
                            children: [
                                { value: '作业.docx', type: 'doc' },
                                { value: '笔记.txt', type: 'doc' }
                            ]
                        },
                        {
                            value: 'Desktop',
                            type: 'folder',
                            children: [
                                { value: '游戏.lnk', type: 'other' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            value: 'Windows',
            type: 'system',
            children: [
                {
                    value: 'System32',
                    type: 'system',
                    children: [
                        { value: 'notepad.exe', type: 'exe' }
                    ]
                }
            ]
        }
    ]
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new TreeVisualizer();
    visualizer.tree = fileSystemTree;
    visualizer.drawTree();
    visualizer.preOrderBtn.classList.add('active');
    visualizer.generateTraversalSteps();
    visualizer.nextStepBtn.disabled = false;
    visualizer.playPauseBtn.disabled = false;
    visualizer.resetBtn.disabled = false;
});