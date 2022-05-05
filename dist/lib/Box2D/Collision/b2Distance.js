import { b2Vec2, b2Math } from '../Common/Math';
import { b2Simplex } from './b2Simplex';
import { b2Settings } from '../Common/b2Settings';
/**
* @private
*/
var b2Distance = /** @class */ (function () {
    function b2Distance() {
        this.__fast__ = true;
    }
    b2Distance.Distance = function (output, cache, input) {
        ++this.b2_gjkCalls;
        var proxyA = input.proxyA;
        var proxyB = input.proxyB;
        var transformA = input.transformA;
        var transformB = input.transformB;
        // Initialize the simplex
        var simplex = this.s_simplex;
        simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
        // Get simplex vertices as an vector.
        var vertices = simplex.m_vertices;
        var k_maxIters = 20;
        // These store the vertices of the last simplex so that we
        // can check for duplicates and preven cycling
        var saveA = this.s_saveA;
        var saveB = this.s_saveB;
        var saveCount = 0;
        var closestPoint = simplex.GetClosestPoint();
        var distanceSqr1 = closestPoint.LengthSquared();
        var distanceSqr2 = distanceSqr1;
        var i /** int */;
        var p;
        // Main iteration loop
        var iter = 0;
        while (iter < k_maxIters) {
            // Copy the simplex so that we can identify duplicates
            saveCount = simplex.m_count;
            for (i = 0; i < saveCount; i++) {
                saveA[i] = vertices[i].indexA;
                saveB[i] = vertices[i].indexB;
            }
            switch (simplex.m_count) {
                case 1:
                    break;
                case 2:
                    simplex.Solve2();
                    break;
                case 3:
                    simplex.Solve3();
                    break;
                default:
                    b2Settings.b2Assert(false);
            }
            // If we have 3 points, then the origin is in the corresponding triangle.
            if (simplex.m_count == 3) {
                break;
            }
            // Compute the closest point.
            p = simplex.GetClosestPoint();
            distanceSqr2 = p.LengthSquared();
            // Ensure progress
            if (distanceSqr2 > distanceSqr1) {
                //break;
            }
            distanceSqr1 = distanceSqr2;
            // Get search direction.
            var d = simplex.GetSearchDirection();
            // Ensure the search direction is numerically fit.
            if (d.LengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE) {
                // THe origin is probably contained by a line segment or triangle.
                // Thus the shapes are overlapped.
                // We can't return zero here even though there may be overlap.
                // In case the simplex is a point, segment or triangle it is very difficult
                // to determine if the origin is contained in the CSO or very close to it
                break;
            }
            // Compute a tentative new simplex vertex using support points
            var vertex = vertices[simplex.m_count];
            vertex.indexA = proxyA.GetSupport(b2Math.MulTMV(transformA.R, d.GetNegative()));
            vertex.wA = b2Math.MulX(transformA, proxyA.GetVertex(vertex.indexA));
            vertex.indexB = proxyB.GetSupport(b2Math.MulTMV(transformB.R, d));
            vertex.wB = b2Math.MulX(transformB, proxyB.GetVertex(vertex.indexB));
            vertex.w = b2Math.SubtractVV(vertex.wB, vertex.wA);
            // Iteration count is equated to the number of support point calls.
            ++iter;
            ++this.b2_gjkIters;
            // Check for duplicate support points. This is the main termination criteria.
            var duplicate = false;
            for (i = 0; i < saveCount; i++) {
                if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
                    duplicate = true;
                    break;
                }
            }
            // If we found a duplicate support point we must exist to avoid cycling
            if (duplicate) {
                break;
            }
            // New vertex is ok and needed.
            ++simplex.m_count;
        }
        this.b2_gjkMaxIters = b2Math.Max(this.b2_gjkMaxIters, iter);
        // Prepare output
        simplex.GetWitnessPoints(output.pointA, output.pointB);
        output.distance = b2Math.SubtractVV(output.pointA, output.pointB).Length();
        output.iterations = iter;
        // Cache the simplex
        simplex.WriteCache(cache);
        // Apply radii if requested.
        if (input.useRadii) {
            var rA = proxyA.m_radius;
            var rB = proxyB.m_radius;
            if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
                // Shapes are still not overlapped.
                // Move the witness points to the outer surface.
                output.distance -= rA + rB;
                var normal = b2Math.SubtractVV(output.pointB, output.pointA);
                normal.Normalize();
                output.pointA.x += rA * normal.x;
                output.pointA.y += rA * normal.y;
                output.pointB.x -= rB * normal.x;
                output.pointB.y -= rB * normal.y;
            }
            else {
                // Shapes are overlapped when radii are considered.
                // Move the witness points to the middle.
                p = new b2Vec2();
                p.x = .5 * (output.pointA.x + output.pointB.x);
                p.y = .5 * (output.pointA.y + output.pointB.y);
                output.pointA.x = output.pointB.x = p.x;
                output.pointA.y = output.pointB.y = p.y;
                output.distance = 0.0;
            }
        }
    };
    b2Distance.s_simplex = new b2Simplex();
    b2Distance.s_saveA = new Array(3);
    b2Distance.s_saveB = new Array(3);
    return b2Distance;
}());
export { b2Distance };
