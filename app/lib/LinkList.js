var obj5 = {
    name: 'obj5',
    next: null
}
var obj4 = {
    name: 'obj4',
    next: obj5
}
var obj3 = {
    name: 'obj3',
    next: obj4
}
var obj2 = {
    name: 'obj2',
    next: obj3
}
var obj1 = {
    name: 'obj1',
    next: obj2
}
// 1,2,3,4,5
//null -> 1 -> 2 -> 3 -> 4

//nullp <- 1pn -> 2px -> 3 -> 4
//null <- 1p <- 2pn -> 3px -> 4
//null <- 1 <- 2p <- 3pn -> 4px
//null <- 1 <- 2 <- 3 <- 4
function reverse(nodeLst){
    var pNode = nodeLst;
    var pPre = null;   //翻转之后 第一个节点的next值 为 null
    var pNext;
    while(pNode){
        pNext = pNode.next;        //获取到当前节点的下一个节点
        pNode.next = pPre;         //当前节点的前一个指向上一个节点
        pPre = pNode;               //上一个节点赋值为当前节点
        pNode = pNext;              //当前节点赋值为下一个节点
    }
    return pPre;
}
function printListFromTailToHead(head)
{
    let arr = [];
    let start = head;
    while(start){
        arr.push(start.name);
        start = start.next;
    }
    return arr.reverse();
}

function printLst(node) { //这段是用来输出链表的
    var p = node
    while (p) {
        console.log(p.name)
        p = p.next
    }
}

// console.log(printLst(printListFromTailToHead(obj1)))

function permutate(str) {
    var result = [];

    if(str.length > 1) {
        var left = str[0];
        var rest = str.slice(1, str.length);
        var preResult = permutate(rest);
        for(var i=0; i<preResult.length; i++) {
            for(var j=0; j<preResult[i].length + 1; j++) {
                var tmp = preResult[i].slice(0, j) + left + preResult[i].slice(j, preResult[i].length);
                result.push(tmp);
            }
        }
    } else if (str.length == 1) {
        return [str];
    }

    return result;
}

// console.log(permutate('abcd'))

function swap(arr,i,j) {
    if(i!=j) {
        var temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
}
var count=[]
function perm(arr) {
    (function fn(n) { //为第n个位置选择元素
        for(var i=n;i<arr.length;i++) {
            swap(arr,i,n);
            if(n+1<arr.length-1) //判断数组中剩余的待全排列的元素是否大于1个
                fn(n+1); //从第n+1个下标进行全排列
            else
                console.log(arr)
            swap(arr,i,n);
        }
    })(0);
}
// perm(["e1","e2","e3","e4"]);

// console.log(count)

// 数组全排列
function Permutation(arr) {
    this.len = 0;    // 存储全排列次数
    this.arr = arr.concat();   // 传入的数组
    this.result = [];    // 存储全排列结果

    // 首次创建对象时初始化方法
    if (typeof Permutation.run == 'undefined') {
        Permutation.prototype.start = function() {
            this.run(0);
        }

        // 递归函数(核心方法)，index为数组下标
        Permutation.prototype.run = function(index) {
            // 单遍历到数组末端时，将结果储存在result数组中，全排列次数加1
            if (index == this.arr.length - 1) {
                this.result.push(this.arr.slice());
                this.len++;
                return;
            }

            for(let i = index; i < this.arr.length; i++) {
                this.swap(this.arr, index, i);      // 与下标为i的元素交换位置
                this.run(index + 1);                // 剩下元素全排列
                this.swap(this.arr, index, i);      // 复原数组
            }
        }

        // 交换位置
        Permutation.prototype.swap = function(array, i, j) {
            var t;
            t = array[i];
            array[i] = array[j];
            array[j] = t;
        }
    }
}

/*var per = new Permutation(['A', 'B', 'C']);
per.start();
console.log(per.result);*/

// 省略参数合法性校验
let bagMatrix = []
function packageMaxValue(weight, value, size){
    // 省略参数合法性校验
    let bagMatrix = []
    for(let w = 0; w <= size; w++) {
        // js不能直接创建二维数组，所以在此初始化数组
        bagMatrix[w] = []
        for (let j = 0; j < 5; j++) {
            // 背包的容量为0，那么一个东西也装不下，此时的值肯定也是为0
            if(w === 0) {
                bagMatrix[w][j] = 0
                continue
            }
            // 背包的容量小于物品j的重量，那么就没有上述情况a了
            if(w < weight[j]){
                bagMatrix[w][j] = bagMatrix[w][j-1] || 0
                continue
            }
            bagMatrix[w][j] = Math.max((bagMatrix[w-weight[j]][j-1] || 0) + value[j], bagMatrix[w][j-1] || 0)
        }
    }
    return bagMatrix
}

let weight = [4, 5, 6, 2, 2]
let value = [6, 4, 5, 3, 6]

console.log(packageMaxValue(weight, value, 10))

function f(nums, value) {
    let count = 0;
    for(let i = 0; i < nums.length; i++){
        if (nums[i] !== value) {
            nums[count] = nums[i];
            count++;
        }
    }
    return count
}
const nums = [2, 3, 4]
const count = f(nums, 3)
console.log(nums, count)
