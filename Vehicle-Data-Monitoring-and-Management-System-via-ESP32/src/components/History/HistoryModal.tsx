import React, { useCallback, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Gauge,
  Timer,
} from "lucide-react";

import "./HistoryModal.css";
import { toast } from "react-toastify";
import { useBackDrop } from "../../views/Backdrop/BackdropProvider";

interface RouteHistoryData {
  startTime: string;
  endTime: string;
  type: "Driving" | "Stop";
  distanceKm: number;
  averageSpeed: number;
  maxSpeed: number;
  latitude: number;
  longitude: number;
}

interface RouteHistoryModalProps {
  onClose: () => void;
  vehicleLicensePlate?: string;
  id?: number;
}

const mockData: RouteHistoryData[] = [
  {
    startTime: "2025-08-14T08:45:32.880314Z",
    endTime: "2025-08-14T09:52:39.988904Z",
    type: "Driving",
    distanceKm: 0.396040577370528,
    averageSpeed: 36.5,
    maxSpeed: 50,
    latitude: 10.772,
    longitude: 106.698,
  },
  {
    startTime: "2025-08-14T09:52:39.988904Z",
    endTime: "2025-08-14T09:54:28.775167Z",
    type: "Stop",
    distanceKm: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    latitude: 10.78,
    longitude: 106.707,
  },
  {
    startTime: "2025-08-14T09:54:28.775167Z",
    endTime: "2025-08-14T16:02:31.139285Z",
    type: "Driving",
    distanceKm: 2.633026262726728,
    averageSpeed: 6.206458532025132,
    maxSpeed: 50,
    latitude: 10.78,
    longitude: 106.707,
  },
];

const RouteHistoryModal: React.FC<RouteHistoryModalProps> = ({
  onClose,
  vehicleLicensePlate,
  id,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [routeData, setRouteData] = useState<RouteHistoryData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { showBackDrop, hideBackDrop } = useBackDrop();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.warn("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc");
      return;
    }

    try {
      showBackDrop();
      // const response = await axiosInstance.get(`localtions/${id}/history-by-time?startTime=${startDate}&endTime=${endDate}`);
      // setRouteData(response.data);

      // Mock data for demonstration
      setRouteData(mockData);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching route history:", error);
      alert("Có lỗi xảy ra khi lấy lịch sử lộ trình");
    } finally {
      hideBackDrop();
    }
  };

  const formatDateTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds}s`;
    } else {
      return `${diffSeconds}s`;
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Driving" ? "#22c55e" : "#ef4444";
  };

  const getTypeIcon = (type: string) => {
    return type === "Driving" ? <Navigation size={20} /> : <MapPin size={20} />;
  };

  const getTotalStats = () => {
    const totalDistance = routeData.reduce(
      (sum, item) => sum + item.distanceKm,
      0
    );
    const drivingSegments = routeData.filter((item) => item.type === "Driving");
    const avgSpeed =
      drivingSegments.length > 0
        ? drivingSegments.reduce((sum, item) => sum + item.averageSpeed, 0) /
          drivingSegments.length
        : 0;
    const maxSpeed = Math.max(...routeData.map((item) => item.maxSpeed));

    return { totalDistance, avgSpeed, maxSpeed };
  };

  const stats = routeData.length > 0 ? getTotalStats() : null;

  return (
    <div className="modalOverlayHistory">
      <div className="routeHistoryModalHistory">
        <div className="modalHeaderHistory">
          <h2 className="modalTitleHistory">
            <Navigation className="modalTitleIconHistory" />
            Lịch sử lộ trình - {vehicleLicensePlate || "N/A"}
          </h2>
          <button className="closeButtonHistory" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modalContentHistory">
          {/* Date Selection Form */}
          <form onSubmit={handleSubmit} className="dateSelectionFormHistory">
            <div className="dateInputsHistory">
              <div className="inputGroupHistory">
                <label htmlFor="startDate" className="inputLabelHistory">
                  <Calendar size={16} />
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="dateInputHistory"
                  required
                />
              </div>
              <div className="inputGroupHistory">
                <label htmlFor="endDate" className="inputLabelHistory">
                  <Calendar size={16} />
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="dateInputHistory"
                  required
                />
              </div>
            </div>
            <button type="submit" className="submitButtonHistory">
              Submit
            </button>
          </form>

          {/* Results Section */}
          {hasSearched && (
            <div className="resultsSectionHistory">
              {routeData.length === 0 ? (
                <div className="noResultsHistory">
                  <MapPin size={48} className="noResultsIconHistory" />
                  <p>Không có dữ liệu lộ trình trong khoảng thời gian này</p>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  {stats && (
                    <div className="summaryStatsHistory">
                      <h3 className="statsTitleHistory">Tổng quan lộ trình</h3>
                      <div className="statsGridHistory">
                        <div className="rowstatItemHistory">
                          <div className="statItemHistory">
                            <Navigation className="statIconHistory" />
                            <div className="statContentHistory">
                              <span className="statLabelHistory">
                                Tổng quãng đường
                              </span>
                              <span className="statValueHistory">
                                {stats.totalDistance.toFixed(2)} km
                              </span>
                            </div>
                          </div>
                          <div className="statItemHistory">
                            <Gauge className="statIconHistory" />
                            <div className="statContentHistory">
                              <span className="statLabelHistory">
                                Tốc độ trung bình
                              </span>
                              <span className="statValueHistory">
                                {stats.avgSpeed.toFixed(1)} km/h
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rowstatItemHistory">
                          <div className="statItemHistory">
                            <Gauge className="statIconHistory" />
                            <div className="statContentHistory">
                              <span className="statLabelHistory">
                                Tốc độ tối đa
                              </span>
                              <span className="statValueHistory">
                                {stats.maxSpeed} km/h
                              </span>
                            </div>
                          </div>
                          <div className="statItemHistory">
                            <Clock className="statIconHistory" />
                            <div className="statContentHistory">
                              <span className="statLabelHistory">Số đoạn</span>
                              <span className="statValueHistory">
                                {routeData.length} đoạn
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Route Timeline */}
                  <div className="routeTimelineHistory">
                    <h3 className="timelineTitleHistory">Chi tiết lộ trình</h3>
                    {routeData.map((segment, index) => (
                      <div key={index} className="timelineItemHistory">
                        <div
                          className="timelineMarkerHistory"
                          style={{
                            backgroundColor: getTypeColor(segment.type),
                          }}
                        >
                          {getTypeIcon(segment.type)}
                        </div>
                        <div className="timelineContentHistory">
                          <div className="segmentHeaderHistory">
                            <span
                              className="segmentTypeHistory"
                              style={{ color: getTypeColor(segment.type) }}
                            >
                              {segment.type === "Driving"
                                ? "Đang di chuyển"
                                : "Đã dừng"}
                            </span>
                            <span className="segmentDurationHistory">
                              <Timer size={14} />
                              {formatDuration(
                                segment.startTime,
                                segment.endTime
                              )}
                            </span>
                          </div>

                          <div className="segmentDetailsHistory">
                            <div className="detailRowHistory">
                              <span className="detailLabelHistory">
                                Thời gian:
                              </span>
                              <span className="detailValueHistory">
                                {formatDateTime(segment.startTime)} →{" "}
                                {formatDateTime(segment.endTime)}
                              </span>
                            </div>

                            <div className="detailRowHistory">
                              <span className="detailLabelHistory">
                                Vị trí:
                              </span>
                              <span className="detailValueHistory">
                                {segment.latitude.toFixed(6)},{" "}
                                {segment.longitude.toFixed(6)}
                              </span>
                            </div>

                            {segment.type === "Driving" && (
                              <>
                                <div className="detailRowHistory">
                                  <span className="detailLabelHistory">
                                    Quãng đường:
                                  </span>
                                  <span className="detailValueHistory">
                                    {segment.distanceKm.toFixed(3)} km
                                  </span>
                                </div>
                                <div className="detailRowHistory">
                                  <span className="detailLabelHistory">
                                    Tốc độ TB:
                                  </span>
                                  <span className="detailValueHistory">
                                    {segment.averageSpeed.toFixed(1)} km/h
                                  </span>
                                </div>
                                <div className="detailRowHistory">
                                  <span className="detailLabelHistory">
                                    Tốc độ tối đa:
                                  </span>
                                  <span className="detailValueHistory">
                                    {segment.maxSpeed} km/h
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteHistoryModal;
