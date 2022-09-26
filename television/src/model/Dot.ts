export default class Dot {
    radius: number = 5; // Size of our element in the 3D world;
    DOT_RADIUS: number = 4;
    PROJECTION_CENTER_X: number;
    PROJECTION_CENTER_Y: number;
    GLOBE_RADIUS: number;
    GLOBE_CENTER_Z: number;
    FIELD_OF_VIEW: number;

    x: number;
    y: number;
    z: number;
    xProject: number = 0;// x coordinate on the 2D world
    yProject: number = 0;// y coordinate on the 2D world
    sizeProjection: number = 0;
    sineRotation: number = 0;
    cosineRotation: number = 0;
    fillStyle: string;

    constructor(private context: CanvasRenderingContext2D, width: number, height: number, colorVersion = false) {

        let globeRadius = (width - 100) * 0.7;
        if (width > height) {
            globeRadius = (height - 100) * 0.7;
        }
        this.GLOBE_RADIUS = globeRadius; // Radius of the globe
        this.GLOBE_CENTER_Z = -this.GLOBE_RADIUS; // Z value of the globe center
        this.FIELD_OF_VIEW = width * 0.8;

        const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
        const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]
        this.x = this.GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
        this.y = this.GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
        this.z = (this.GLOBE_RADIUS * Math.cos(phi)) + this.GLOBE_CENTER_Z;

        this.PROJECTION_CENTER_X = width / 2; // x center of the canvas
        this.PROJECTION_CENTER_Y = height / 2; // y center of the canvas
        this.fillStyle = colorVersion ? `hsl(${Math.random() * 360},50%,50%)` : "black";
    }

    // Project our element from its 3D world to the 2D canvas
    project(sin: number, cos: number) {
        const rotX = cos * this.x + sin * (this.z - this.GLOBE_CENTER_Z);
        const rotZ = -sin * this.x + cos * (this.z - this.GLOBE_CENTER_Z) + this.GLOBE_CENTER_Z;
        this.sizeProjection = this.FIELD_OF_VIEW / (this.FIELD_OF_VIEW - rotZ);
        this.xProject = (rotX * this.sizeProjection) + this.PROJECTION_CENTER_X;
        this.yProject = (this.y * this.sizeProjection) + this.PROJECTION_CENTER_Y;
    }

    // Draw the dot on the canvas
    draw(timestamp: DOMHighResTimeStamp) {
        const rotation = timestamp * 0.0004;

        this.sineRotation = Math.sin(rotation); // Sine of the rotrotationtion
        this.cosineRotation = Math.cos(rotation); // Cosine of the rorotationation
        this.project(this.sineRotation, this.cosineRotation);
        // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
        this.context.beginPath();
        this.context.fillStyle = this.fillStyle;
        this.context.arc(this.xProject, this.yProject, this.DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();
    }
}