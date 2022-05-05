import { b2Fixture } from './b2Fixture';
import { b2Joint } from './Joints';
/**
* Joints and shapes are destroyed when their associated
* body is destroyed. Implement this listener so that you
* may nullify references to these joints and shapes.
*/
export declare class b2DestructionListener {
    __fast__: boolean;
    /**
    * Called when any joint is about to be destroyed due
    * to the destruction of one of its attached bodies.
    */
    SayGoodbyeJoint(joint: b2Joint): void;
    /**
    * Called when any fixture is about to be destroyed due
    * to the destruction of its parent body.
    */
    SayGoodbyeFixture(fixture: b2Fixture): void;
}
//# sourceMappingURL=b2DestructionListener.d.ts.map