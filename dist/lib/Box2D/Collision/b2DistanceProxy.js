import { b2Shape } from './Shapes/b2Shape';
import { b2Settings } from '../Common/b2Settings';
/**
 * A distance proxy is used by the GJK algorithm.
 * It encapsulates any shape.
 */
var b2DistanceProxy = /** @class */ (function () {
    function b2DistanceProxy() {
        this.__fast__ = true;
    }
    /**
     * Initialize the proxy using the given shape. The shape
     * must remain in scope while the proxy is in use.
     */
    b2DistanceProxy.prototype.Set = function (shape) {
        switch (shape.GetType()) {
            case b2Shape.e_circleShape:
                {
                    var circle = shape;
                    this.m_vertices = new Array(1);
                    this.m_vertices[0] = circle.m_p;
                    this.m_count = 1;
                    this.m_radius = circle.m_radius;
                }
                break;
            case b2Shape.e_polygonShape:
                {
                    var polygon = shape;
                    this.m_vertices = polygon.m_vertices;
                    this.m_count = polygon.m_vertexCount;
                    this.m_radius = polygon.m_radius;
                }
                break;
            default:
                b2Settings.b2Assert(false);
        }
    };
    /**
     * Get the supporting vertex index in the given direction.
     */
    b2DistanceProxy.prototype.GetSupport = function (d) {
        var bestIndex = 0;
        var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
        for (var i = 1; i < this.m_count; ++i) {
            var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
            if (value > bestValue) {
                bestIndex = i;
                bestValue = value;
            }
        }
        return bestIndex;
    };
    /**
     * Get the supporting vertex in the given direction.
     */
    b2DistanceProxy.prototype.GetSupportVertex = function (d) {
        var bestIndex = 0;
        var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
        for (var i = 1; i < this.m_count; ++i) {
            var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
            if (value > bestValue) {
                bestIndex = i;
                bestValue = value;
            }
        }
        return this.m_vertices[bestIndex];
    };
    /**
     * Get the vertex count.
     */
    b2DistanceProxy.prototype.GetVertexCount = function () {
        return this.m_count;
    };
    /**
     * Get a vertex by index. Used by b2Distance.
     */
    b2DistanceProxy.prototype.GetVertex = function (index /** int */) {
        b2Settings.b2Assert(0 <= index && index < this.m_count);
        return this.m_vertices[index];
    };
    return b2DistanceProxy;
}());
export { b2DistanceProxy };
