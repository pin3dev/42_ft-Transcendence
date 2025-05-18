
export class Ball{
    public static readonly SIZE: number = 10;
    public static readonly VX: number = 5;
    public static readonly VY: number = 3;

    private x: number = 0;
    private y: number = 0;
	private vx: number = Ball.VX;
	private vy: number = Ball.VY;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public get getX(){
        return this.x;
    }

    public set setX(x: number){
        this.x = x;
    }

    public get getY(){
        return this.y;
    }

    public set setY(y: number){
        this.y = y;
    }

	public get getVX(){
        return this.vx;
    }

    public set setVX(vx: number){
        this.vx = vx;
    }

	public get getVY(){
        return this.vy;
    }

    public set setVY(vy: number){
        this.vy = vy;
    }

}
