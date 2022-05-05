/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
import { b2Vec2 } from '../Common/Math/b2Vec2';
import { b2MassData } from '../Collision/Shapes/b2MassData';
/// A body definition holds all the data needed to construct a rigid body.
/// You can safely re-use body definitions.
var b2BodyDef = /** @class */ (function () {
    /// This constructor sets the body definition default values.
    function b2BodyDef() {
        this.__fast__ = true;
        /// You can use this to initialized the mass properties of the body.
        /// If you prefer, you can set the mass properties after the shapes
        /// have been added using b2Body::SetMassFromShapes.
        this.massData = new b2MassData();
        /// The world position of the body. Avoid creating bodies at the origin
        /// since this can lead to many overlapping shapes.
        this.position = new b2Vec2();
        this.massData.center.SetZero();
        this.massData.mass = 0.0;
        this.massData.I = 0.0;
        this.userData = null;
        this.position.Set(0.0, 0.0);
        this.angle = 0.0;
        this.linearDamping = 0.0;
        this.angularDamping = 0.0;
        this.allowSleep = true;
        this.isSleeping = false;
        this.fixedRotation = false;
        this.isBullet = false;
    }
    return b2BodyDef;
}());
export { b2BodyDef };
