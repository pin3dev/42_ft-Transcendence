
export class Paddle{

	public static readonly SPACE_FROM_SIDE = 30;
	public static readonly SPEED = 8;

	public static readonly WIDTH: number = 14;
    public static readonly HEIGHT: number = 90;

    private x: number;
    private y: number;

    constructor(x: number, y:number){
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
}
