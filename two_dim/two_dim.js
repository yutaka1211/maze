// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = 960;
  const height = 540;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);

  // カメラの初期座標を設定
  camera.position.set(0, 2000, 0);

  // カメラコントローラーを作成
  const controls = new THREE.OrbitControls(camera);

  //軸を作成(緑がy軸、赤がx軸、青がz軸)
  const plane2=new THREE.AxesHelper(300);
  scene.add(plane2);

  //迷路の大きさ(奇数の値)
  const n=131;

  //迷路の配列作成
  let maze = new Array(n);
  for(let x=0;x<n;x++){
    maze[x] = new Array(n);
    for(let y=0;y<n;y++){
      maze[x][y]=0;
    }
  }

  //周りの壁作成
  for(let i=n*50;i>=-((n-2)*50);i-=100){
    for(let j=-n*50;j<=((n-2)*50);j+=100){
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(100,100,100),
        new THREE.MeshNormalMaterial({
        })
      );
      if(i===n*50 || i===-((n-2)*50) || j===-(n*50) || j===(n-2)*50){
        wall.position.x=i;
        wall.position.z=j;
        scene.add(wall);                                        //外側の壁を作成
        maze[(n/2)-(i/100)][(n/2)+(j/100)]=1;                   //壁について配列を更新
      }
    }
  }
　
  //中の壁作成
  for(let i=(n-4)*50;i>=-(n-4)*50;i-=200){
    for(let j=-(n-4)*50;j<(n-4)*50;j+=200){
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(100,100,100),
        new THREE.MeshNormalMaterial()
      );
      wall.position.x=i;
      wall.position.z=j;
      scene.add(wall);                                          //内側の壁を作成
      maze[(n/2)-(i/100)][(n/2)+(j/100)]=1;                     //壁について配列を更新

      /*それぞれの壁から棒を倒す*/
      while(1){
        let dir;
        if(i===(n-4)*50){ dir=Math.floor( Math.random()*4); }   //最上段のみ上に壁を作成できる
        else { dir=Math.floor(Math.random()*3); }
        let wallred=i;
        let wallblue=j;
        switch(dir){
          case 0:
            wallblue+=100;
            break;
          case 1:
            wallred-=100;
            break;
          case 2:
            wallblue-=100;
            break;
          case 3:
            wallred+=100;
            break;
        }
        if(maze[(n/2)-(wallred/100)][(n/2)+(wallblue/100)]===0){  //倒したい場所に壁がない場合
          const wall = new THREE.Mesh(
            new THREE.BoxGeometry(100,100,100),
            new THREE.MeshNormalMaterial()
          );
          wall.position.x=wallred;
          wall.position.z=wallblue;
          scene.add(wall);                                        //棒を倒す
          maze[(n/2)-(wallred/100)][(n/2)+(wallblue/100)]=1;      //壁について配列を更新
          break;
        }
      }
    }
  }

  tick();

  function tick() {
    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  onResize();

  //全画面表示
  window.addEventListener('resize', onResize);

  function onResize(){
    const width =window.innerWidth;
    const height=window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width /height;
    camera.updateProjectionMatrix();
  }
}