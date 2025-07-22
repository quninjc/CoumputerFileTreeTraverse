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
        this.rightTree = null;
        this.traversalSteps = [];
        this.currentStepIndex = -1;
        this.isPlaying = false;
        this.playInterval = null;
        this.playSpeed = 1000;
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.treeSelect = document.getElementById('treeSelect');
        this.treeContainerLeft = document.getElementById('treeContainerLeft');
        this.treeContainerRight = document.getElementById('treeContainerRight');
        this.traversalSequence = document.getElementById('traversalSequence');
        this.currentStepInfo = document.getElementById('currentStep');
        this.nextStepBtn = document.getElementById('nextStep');
        this.playPauseBtn = document.getElementById('playPause');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        this.traversalBtns = [];
    }

    // 深拷贝树结构
    cloneTree(node) {
        if (!node) return null;
        const newNode = { ...node, children: node.children ? node.children.map(child => this.cloneTree(child)) : undefined };
        return newNode;
    }

    bindEvents() {
        this.treeSelect.addEventListener('change', (e) => {
            const key = e.target.value;
            this.tree = gameTrees[key];
            this.generateTraversalSteps();
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
        // 右树重置
        this.rightTree = this.cloneTree(this.tree);
        this.hideAllNodes(this.rightTree);
        this.updateTraversalDisplay();
        this.linkTwinNodes(this.tree, this.rightTree); // 保证节点映射
        this.drawTrees();
        this.highlightCurrentStep();
        // 保证按钮可用
        this.nextStepBtn.disabled = false;
        this.playPauseBtn.disabled = false;
        this.resetBtn.disabled = false;
    }

    // 隐藏右树所有节点
    hideAllNodes(node) {
        if (!node) return;
        node._show = false;
        if (node.children) node.children.forEach(child => this.hideAllNodes(child));
    }

    // 先序遍历
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
        // 右树显示到当前遍历节点
        if (this.currentStepIndex === -1) {
            // 初始时右树完全空白
            this.hideAllNodes(this.rightTree);
        } else {
            this.showRightTreeUpToStep(this.currentStepIndex);
        }
        for (let i = 0; i <= this.currentStepIndex; i++) {
            const step = this.traversalSteps[i];
            if (step && step.node._leftElement) {
                if (i === this.currentStepIndex) {
                    step.node._leftElement.classList.add('highlighted');
                } else {
                    step.node._leftElement.classList.add('visited');
                }
            }
        }
        this.updateTraversalDisplay();
        this.updateCurrentStepInfo();
        this.drawTrees();
    }

    // 右树显示到当前遍历节点
    showRightTreeUpToStep(stepIndex) {
        // 先全部隐藏
        this.hideAllNodes(this.rightTree);
        // 根节点始终显示
        if (this.rightTree) this.rightTree._show = true;
        // 依次显示已遍历到的节点
        for (let i = 0; i <= stepIndex; i++) {
            const step = this.traversalSteps[i];
            if (step && step.node._rightTwin) {
                step.node._rightTwin._show = true;
            }
        }
    }

    clearHighlights() {
        const nodes = this.treeContainerLeft.querySelectorAll('.node');
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
        this.generateTraversalSteps();
    }

    // --- 双树布局与绘制 ---
    // 智能多叉树布局，递归计算每个节点的布局宽度，避免底层节点重叠
    calculateSubtreeWidth(node) {
        const nodeWidth = 60;
        const horizontalGap = 12; // 节点同层间距更近
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

    assignTreeLayout(node, x, y) {
        const nodeWidth = 60;
        const horizontalGap = 12; // 节点同层间距更近
        const verticalSpacing = 110; // 层与层间隔更大
        node.x = x;
        node.y = y;
        if (!node.children || node.children.length === 0) return;
        let totalWidth = 0;
        node.children.forEach(child => {
            totalWidth += child._subtreeWidth;
        });
        totalWidth += (node.children.length - 1) * horizontalGap;
        let startX = x - totalWidth / 2;
        node.children.forEach(child => {
            const childCenter = startX + child._subtreeWidth / 2;
            const childY = y + verticalSpacing;
            this.assignTreeLayout(child, childCenter, childY);
            startX += child._subtreeWidth + horizontalGap;
        });
    }

    // 关键：双树同步布局和节点映射
    drawTrees() {
        const innerLeft = document.getElementById('treeInnerLeft');
        const innerRight = document.getElementById('treeInnerRight');
        innerLeft.innerHTML = '';
        innerRight.innerHTML = '';
        // 左树布局
        this.calculateSubtreeWidth(this.tree);
        const leftTreeW = this.tree._subtreeWidth;
        this.assignTreeLayout(this.tree, leftTreeW / 2, 0);
        // 右树布局
        this.calculateSubtreeWidth(this.rightTree);
        const rightTreeW = this.rightTree._subtreeWidth;
        this.assignTreeLayout(this.rightTree, rightTreeW / 2, 0);
        // 计算边界
        const leftBounds = this.getTreeBounds(this.tree);
        const rightBounds = this.getTreeBounds(this.rightTree);
        // 缩放比例，保证树完整缩放进红色画框
        const margin = 10;
        const nodeW = 56, nodeH = 48;
        const leftTreeRealW = leftBounds.maxX - leftBounds.minX + nodeW;
        const leftTreeRealH = leftBounds.maxY - leftBounds.minY + nodeH;
        const leftScale = Math.min((this.treeContainerLeft.clientWidth - margin) / leftTreeRealW, (this.treeContainerLeft.clientHeight - margin) / leftTreeRealH, 1);
        const rightTreeRealW = rightBounds.maxX - rightBounds.minX + nodeW;
        const rightTreeRealH = rightBounds.maxY - rightBounds.minY + nodeH;
        const rightScale = Math.min((this.treeContainerRight.clientWidth - margin) / rightTreeRealW, (this.treeContainerRight.clientHeight - margin) / rightTreeRealH, 1);
        // 平移量：让树左上角对齐容器左上角加margin/2，并垂直居中
        const leftExtraY = (this.treeContainerLeft.clientHeight - leftTreeRealH * leftScale) / 2;
        const leftOffsetX = margin / 2 - leftBounds.minX + 30;
        const leftOffsetY = margin / 2 - leftBounds.minY + 20 + leftExtraY;
        innerLeft.style.transform = `scale(${leftScale}) translate(${leftOffsetX}px,${leftOffsetY}px)`;
        const rightExtraY = (this.treeContainerRight.clientHeight - rightTreeRealH * rightScale) / 2;
        const rightOffsetX = margin / 2 - rightBounds.minX + 30;
        const rightOffsetY = margin / 2 - rightBounds.minY + 20 + rightExtraY;
        innerRight.style.transform = `scale(${rightScale}) translate(${rightOffsetX}px,${rightOffsetY}px)`;
        // 绘制
        this.drawGeneralTree(this.tree, innerLeft, true);
        this.drawGeneralTree(this.rightTree, innerRight, false);
    }

    // 平移整棵树
    shiftTree(node, dx, dy) {
        if (!node) return;
        node.x += dx;
        node.y += dy;
        if (node.children) node.children.forEach(child => this.shiftTree(child, dx, dy));
    }

    // 计算树的边界
    getTreeBounds(node, bounds = {minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity}) {
        if (!node) return bounds;
        if (node.x < bounds.minX) bounds.minX = node.x;
        if (node.x > bounds.maxX) bounds.maxX = node.x;
        if (node.y < bounds.minY) bounds.minY = node.y;
        if (node.y > bounds.maxY) bounds.maxY = node.y;
        if (node.children) node.children.forEach(child => this.getTreeBounds(child, bounds));
        return bounds;
    }
    // 计算缩放比例
    getFitScale(bounds, containerW, containerH) {
        const nodeW = 56, nodeH = 48;
        const treeW = bounds.maxX - bounds.minX + nodeW;
        const treeH = bounds.maxY - bounds.minY + nodeH;
        const scaleW = (containerW - 10) / treeW;
        const scaleH = (containerH - 10) / treeH;
        return Math.min(0.6, scaleW, scaleH); // 0.6 保证再大的树也能完整显示
    }

    // 建立左右树节点一一映射
    linkTwinNodes(left, right) {
        if (!left || !right) return;
        left._rightTwin = right;
        right._leftTwin = left;
        if (left.children && right.children) {
            for (let i = 0; i < left.children.length; i++) {
                this.linkTwinNodes(left.children[i], right.children[i]);
            }
        }
    }

    // 绘制多叉树，showAll为true时全部显示，否则只显示_show为true的节点
    drawGeneralTree(node, container, showAll) {
        if (!node) return;
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                // 右树只画已显示的节点的连线
                if (showAll || child._show) {
                    this.drawEdge(node, child, container);
                }
                this.drawGeneralTree(child, container, showAll);
            });
        }
        if (showAll || node._show) {
            this.drawNode(node, container, showAll);
        }
    }

    drawNode(node, container, showAll) {
        console.log('drawNode', node.value, node.x, node.y);
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node file-node ' + (node.type || 'folder');
        nodeElement.innerHTML = `<span class="file-icon">${this.getNodeIcon(node)}</span><span class="file-label">${node.value}</span>`;
        const nodeW = 56, nodeH = 48;
        nodeElement.style.left = (node.x - nodeW / 2) + 'px';
        nodeElement.style.top = (node.y - nodeH / 2) + 'px';
        container.appendChild(nodeElement);
        if (showAll) node._leftElement = nodeElement;
    }

    drawEdge(parent, child, container) {
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
        container.appendChild(edge);
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

// 多个游戏/系统文件夹树结构
const gameTrees = {
    snake: {
        value: '贪吃蛇', type: 'folder', children: [
            { value: '代码', type: 'folder', children: [
                { value: 'main.py', type: 'doc' },
                { value: 'snake.py', type: 'doc' },
                { value: 'food.py', type: 'doc' },
                { value: 'utils', type: 'folder', children: [
                    { value: 'helper.py', type: 'doc' },
                    { value: 'constants.py', type: 'doc' }
                ]}
            ]},
            { value: '图片', type: 'folder', children: [
                { value: 'snake', type: 'folder', children: [
                    { value: 'snake_head.png', type: 'other' },
                    { value: 'snake_body.png', type: 'other' }
                ]},
                { value: 'food.png', type: 'other' },
                { value: 'bg.jpg', type: 'other' }
            ]},
            { value: '音乐', type: 'folder', children: [
                { value: 'bgm', type: 'folder', children: [
                    { value: 'bgm.mp3', type: 'other' }
                ]},
                { value: 'eat.wav', type: 'other' }
            ]},
            { value: '说明文档', type: 'folder', children: [
                { value: 'README.md', type: 'doc' },
                { value: 'CHANGELOG.md', type: 'doc' }
            ]},
            { value: '配置', type: 'folder', children: [
                { value: 'config', type: 'folder', children: [
                    { value: 'config.json', type: 'doc' },
                    { value: 'env.json', type: 'doc' }
                ]}
            ]}
        ]
    },
    minesweeper: {
        value: '扫雷', type: 'folder', children: [
            { value: 'src', type: 'folder', children: [
                { value: 'main.cpp', type: 'doc' },
                { value: 'game.cpp', type: 'doc' },
                { value: 'game.h', type: 'doc' },
                { value: 'logic', type: 'folder', children: [
                    { value: 'mine_logic.cpp', type: 'doc' },
                    { value: 'mine_logic.h', type: 'doc' }
                ]}
            ]},
            { value: '资源', type: 'folder', children: [
                { value: 'mine.png', type: 'other' },
                { value: 'flag.png', type: 'other' },
                { value: 'icons', type: 'folder', children: [
                    { value: 'icon1.png', type: 'other' },
                    { value: 'icon2.png', type: 'other' }
                ]}
            ]},
            { value: '音乐', type: 'folder', children: [
                { value: 'win.wav', type: 'other' },
                { value: 'lose.wav', type: 'other' }
            ]},
            { value: 'README.md', type: 'doc' }
        ]
    },
    tetris: {
        value: '俄罗斯方块', type: 'folder', children: [
            { value: 'src', type: 'folder', children: [
                { value: 'main.js', type: 'doc' },
                { value: 'tetris.js', type: 'doc' },
                { value: 'blocks', type: 'folder', children: [
                    { value: 'block_I.js', type: 'doc' },
                    { value: 'block_O.js', type: 'doc' },
                    { value: 'block_T.js', type: 'doc' }
                ]}
            ]},
            { value: '图片', type: 'folder', children: [
                { value: 'block.png', type: 'other' },
                { value: 'bg', type: 'folder', children: [
                    { value: 'bg1.jpg', type: 'other' },
                    { value: 'bg2.jpg', type: 'other' }
                ]}
            ]},
            { value: '音乐', type: 'folder', children: [
                { value: 'bgm.mp3', type: 'other' },
                { value: 'rotate.wav', type: 'other' }
            ]},
            { value: 'README.md', type: 'doc' }
        ]
    },
    pushbox: {
        value: '推箱子', type: 'folder', children: [
            { value: 'src', type: 'folder', children: [
                { value: 'main.cpp', type: 'doc' },
                { value: 'level.cpp', type: 'doc' },
                { value: 'solver', type: 'folder', children: [
                    { value: 'solver.cpp', type: 'doc' },
                    { value: 'solver.h', type: 'doc' }
                ]}
            ]},
            { value: '关卡', type: 'folder', children: [
                { value: 'level1.txt', type: 'doc' },
                { value: 'level2.txt', type: 'doc' },
                { value: 'custom', type: 'folder', children: [
                    { value: 'custom1.txt', type: 'doc' }
                ]}
            ]},
            { value: '图片', type: 'folder', children: [
                { value: 'box.png', type: 'other' },
                { value: 'player.png', type: 'other' }
            ]},
            { value: 'README.md', type: 'doc' }
        ]
    },
    gomoku: {
        value: '五子棋', type: 'folder', children: [
            { value: 'src', type: 'folder', children: [
                { value: 'main.py', type: 'doc' },
                { value: 'ai.py', type: 'doc' },
                { value: 'ai', type: 'folder', children: [
                    { value: 'ai_core.py', type: 'doc' },
                    { value: 'ai_utils.py', type: 'doc' }
                ]}
            ]},
            { value: '图片', type: 'folder', children: [
                { value: 'board.png', type: 'other' },
                { value: 'pieces', type: 'folder', children: [
                    { value: 'black.png', type: 'other' },
                    { value: 'white.png', type: 'other' }
                ]}
            ]},
            { value: 'README.md', type: 'doc' }
        ]
    },
    cdrive: {
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
                            { value: 'Excel.exe', type: 'exe' },
                            { value: 'Tools', type: 'folder', children: [
                                { value: 'ToolA.exe', type: 'exe' }
                            ]}
                        ]
                    },
                    {
                        value: 'Chrome',
                        type: 'folder',
                        children: [
                            { value: 'chrome.exe', type: 'exe' },
                            { value: 'Extensions', type: 'folder', children: [
                                { value: 'ext1.dll', type: 'other' }
                            ]}
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
                                    { value: '笔记.txt', type: 'doc' },
                                    { value: 'Notes', type: 'folder', children: [
                                        { value: 'note1.txt', type: 'doc' }
                                    ]}
                                ]
                            },
                            {
                                value: 'Desktop',
                                type: 'folder',
                                children: [
                                    { value: '游戏.lnk', type: 'other' },
                                    { value: 'Shortcuts', type: 'folder', children: [
                                        { value: 'shortcut1.lnk', type: 'other' }
                                    ]}
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
                            { value: 'notepad.exe', type: 'exe' },
                            { value: 'drivers', type: 'folder', children: [
                                { value: 'driver1.sys', type: 'other' }
                            ]}
                        ]
                    }
                ]
            }
        ]
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new TreeVisualizer();
    // 默认展示贪吃蛇
    visualizer.tree = gameTrees.snake;
    visualizer.generateTraversalSteps();
    visualizer.nextStepBtn.disabled = false;
    visualizer.playPauseBtn.disabled = false;
    visualizer.resetBtn.disabled = false;
    // 设置下拉框默认选中
    const treeSelect = document.getElementById('treeSelect');
    treeSelect.value = 'snake';
});